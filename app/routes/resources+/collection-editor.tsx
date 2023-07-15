import type { DataFunctionArgs } from '@remix-run/node';
import type { Collection } from '@prisma/client';
import { json } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { z } from 'zod';
import { requireUserId } from '~/utils/auth.server.ts';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import { prisma } from '~/utils/db.server.ts';
import { toCamelCase } from '~/utils/misc.ts';
import { redirectWithToast } from '~/utils/flash-session.server.ts';
import { conform, useForm } from '@conform-to/react';
import { ErrorList, Field } from '~/components/forms.tsx';
import { Button } from '~/components/ui/button.tsx';
import { StatusButton } from '~/components/ui/status-button.tsx';

export const CollectionEditorSchema = z.object({
	id: z.string().optional(), // optional because we may be creating a new collection
	title: z.string().min(1),
	description: z.string().nullable(),
});

export const action = async ({ request }: DataFunctionArgs) => {
	const userId = await requireUserId(request);

	if (!userId) {
		throw json({ message: 'Unauthorized' }, { status: 401 });
	}

	const formData = await request.formData();
	const submission = parse(formData, {
		schema: CollectionEditorSchema,
		acceptMultipleErrors: () => true,
	});

	if (submission.intent !== 'submit') {
		return json({ status: 'idle', submission } as const);
	}

	if (!submission.value) {
		return json(
			{
				status: 'error',
				submission,
			} as const,
			{ status: 400 },
		);
	}

	const { id, title, description } = submission.value;

	let collection: { id: string };
	const select = {
		id: true,
	};

	if (id) {
		// Update existing collection
		const existingCollection = await prisma.collection.findFirst({
			where: { id },
			select: { id: true },
		});
		if (!existingCollection) {
			return json(
				{
					status: 'error',
					submission,
				} as const,
				{ status: 404 },
			);
		}
		collection = await prisma.collection.update({
			where: { id },
			data: {
				title,
				description,
			},
			select,
		});
	} else {
		// Create new collection
		collection = await prisma.collection.create({
			data: {
				title,
				handle: toCamelCase(title),
				description,
			},
			select,
		});
	}

	return redirectWithToast(`/cms/data-model`, {
		title: id ? 'Collection updated' : 'Collection created',
	});
};

export function CollectionEditor({
	collection,
}: {
	collection?: Pick<Collection, 'id' | 'title' | 'description'>;
}) {
	const collectionEditorFetcher = useFetcher<typeof action>();

	const [form, fields] = useForm({
		id: 'collection-editor',
		constraint: getFieldsetConstraint(CollectionEditorSchema),
		lastSubmission: collectionEditorFetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: CollectionEditorSchema });
		},
		defaultValue: {
			title: collection?.title,
			description: collection?.description,
		},
		shouldRevalidate: 'onBlur',
	});

	return (
		<collectionEditorFetcher.Form
			method="post"
			action="/resources/collection-editor"
			{...form.props}
		>
			<input name="id" type="hidden" value={collection?.id} />
			<Field
				labelProps={{ children: 'Title' }}
				inputProps={{
					...conform.input(fields.title),
					autoComplete: 'title',
				}}
				errors={fields.title.errors}
			/>
			<Field
				labelProps={{ children: 'Description' }}
				inputProps={{
					...conform.input(fields.description),
					autoComplete: 'description',
				}}
				errors={fields.description.errors}
			/>
			<ErrorList errors={form.errors} id={form.errorId} />
			<div className="flex justify-end gap-4">
				<Button variant="secondary" type="reset">
					Reset
				</Button>
				<Button type="submit">
					{!collection ? 'Create Collection' : 'Save Changes'}
				</Button>
			</div>
		</collectionEditorFetcher.Form>
	);
}
