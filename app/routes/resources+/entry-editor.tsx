import type { DataFunctionArgs } from '@remix-run/node';
import type { Collection, Entry } from '@prisma/client';
import { json, redirect } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { z } from 'zod';
import { requireUserId } from '~/utils/auth.server.ts';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import { prisma } from '~/utils/db.server.ts';
import { toSlug } from '~/utils/misc.ts';
import { redirectWithToast } from '~/utils/flash-session.server.ts';
import { conform, useForm } from '@conform-to/react';
import { ErrorList, Field } from '~/components/forms.tsx';
import { Button } from '~/components/ui/button.tsx';
import { StatusButton } from '~/components/ui/status-button.tsx';

export const EntryEditorSchema = z.object({
	id: z.string().optional(), // optional because we may be creating a new entry
	title: z.string().min(1),
	slug: z.string().min(1),
	collectionId: z.string().min(1),
});

export const action = async ({ request }: DataFunctionArgs) => {
	const userId = await requireUserId(request);
	const formData = await request.formData();
	const submission = parse(formData, {
		schema: EntryEditorSchema,
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

	const { id, collectionId, title } = submission.value;

	let entry: { id: string };
	const select = {
		id: true,
	};

	if (id) {
		// Update existing entry
		const existingNote = await prisma.entry.findFirst({
			where: { id },
			select: { id: true },
		});
		if (!existingNote) {
			return json(
				{
					status: 'error',
					submission,
				} as const,
				{ status: 404 },
			);
		}
		entry = await prisma.entry.update({
			where: { id },
			data: {
				title,
				slug: toSlug(title),
			},
			select,
		});
	} else {
		// Create new entry
		entry = await prisma.entry.create({
			data: {
				title,
				slug: toSlug(title),
				authorId: userId,
				collectionId,
			},
			select,
		});
	}

	return redirectWithToast(`/cms/content/${collectionId}/${entry.id}`, {
		title: id ? 'Entry updated' : 'Entry created',
	});
};

export function EntryEditor({
	collectionId,
	entry,
}: {
	collectionId: Collection['id'];
	entry?: Pick<Entry, 'id' | 'title' | 'slug' | 'authorId' | 'collectionId'>;
}) {
	const entryEditorFetcher = useFetcher<typeof action>();

	const [form, fields] = useForm({
		id: 'note-editor',
		constraint: getFieldsetConstraint(EntryEditorSchema),
		lastSubmission: entryEditorFetcher.data?.submission,
		onValidate({ formData }) {
			return parse(formData, { schema: EntryEditorSchema });
		},
		defaultValue: {
			title: entry?.title,
			slug: entry?.slug,
		},
		shouldRevalidate: 'onBlur',
	});

	return (
		<entryEditorFetcher.Form
			method="post"
			action="/resources/entry-editor"
			{...form.props}
		>
			<input name="id" type="hidden" value={entry?.id} />
			<input name="collectionId" type="hidden" value={collectionId} />
			<Field
				labelProps={{ children: 'Title' }}
				inputProps={{
					...conform.input(fields.title),
					autoComplete: 'title',
				}}
				errors={fields.title.errors}
			/>
			<Field
				labelProps={{ children: 'Slug' }}
				inputProps={{
					...conform.input(fields.slug),
					autoComplete: 'slug',
				}}
				errors={fields.slug.errors}
			/>
			<ErrorList errors={form.errors} id={form.errorId} />
			<div className="flex justify-end gap-4">
				<Button variant="secondary" type="reset">
					Reset
				</Button>
				<StatusButton
					status={
						entryEditorFetcher.state === 'submitting'
							? 'pending'
							: entryEditorFetcher.data?.status ?? 'idle'
					}
					type="submit"
					disabled={entryEditorFetcher.state !== 'idle'}
				>
					Submit
				</StatusButton>
			</div>
		</entryEditorFetcher.Form>
	);
}
