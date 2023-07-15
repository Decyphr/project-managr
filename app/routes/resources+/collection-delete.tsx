import { json, type DataFunctionArgs } from '@remix-run/node';
import { useFetcher } from '@remix-run/react';
import { ErrorList } from '~/components/forms.tsx';
import { useForm } from '@conform-to/react';
import { getFieldsetConstraint, parse } from '@conform-to/zod';
import { z } from 'zod';
import { requireUserId } from '~/utils/auth.server.ts';
import { prisma } from '~/utils/db.server.ts';
import { StatusButton } from '~/components/ui/status-button.tsx';
import { redirectWithToast } from '~/utils/flash-session.server.ts';
import { Button } from '~/components/ui/button.tsx';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '~/components/ui/dialog.tsx';
import { Cross2Icon } from '@radix-ui/react-icons';
import { Collection } from '@prisma/client';

const DeleteCollectionSchema = z.object({
	collectionId: z.string(),
});

export async function action({ request }: DataFunctionArgs) {
	const userId = await requireUserId(request);
	const formData = await request.formData();
	const submission = parse(formData, {
		schema: DeleteCollectionSchema,
		acceptMultipleErrors: () => true,
	});
	if (!submission.value || submission.intent !== 'submit') {
		return json(
			{
				status: 'error',
				submission,
			} as const,
			{ status: 400 },
		);
	}

	const { collectionId } = submission.value;

	const collection = await prisma.collection.findFirst({
		select: { id: true },
		where: {
			id: collectionId,
		},
	});
	if (!collection) {
		submission.error.collectionId = ['Collection not found'];
		return json({ status: 'error', submission } as const, {
			status: 404,
		});
	}

	await prisma.collection.delete({
		where: { id: collection.id },
	});

	return redirectWithToast(`/cms/data-model`, {
		title: 'Collection deleted',
		variant: 'destructive',
	});
}

export function DeleteCollection({
	collection,
}: {
	collection: Pick<Collection, 'id' | 'title'>;
}) {
	const collectionDeleteFetcher = useFetcher<typeof action>();

	const [form] = useForm({
		id: 'delete-collection',
		constraint: getFieldsetConstraint(DeleteCollectionSchema),
		onValidate({ formData }) {
			return parse(formData, { schema: DeleteCollectionSchema });
		},
	});

	return (
		<Dialog>
			<DialogTrigger asChild>
				<Button size="icon" variant="destructive">
					<Cross2Icon />
				</Button>
			</DialogTrigger>
			<DialogContent className="sm:max-w-[425px]">
				<DialogHeader>
					<DialogTitle>Delete the '{collection.title}' collection?</DialogTitle>
					<DialogDescription>
						Deleting a collection will also delete all of its related entries.
					</DialogDescription>
				</DialogHeader>
				<collectionDeleteFetcher.Form
					method="post"
					action="/resources/collection-delete"
					{...form.props}
				>
					<input type="hidden" name="collectionId" value={collection.id} />
					<ErrorList errors={form.errors} id={form.errorId} />
					<DialogFooter>
						<StatusButton
							type="submit"
							variant="destructive"
							status={
								collectionDeleteFetcher.state === 'submitting'
									? 'pending'
									: collectionDeleteFetcher.data?.status ?? 'idle'
							}
							disabled={collectionDeleteFetcher.state !== 'idle'}
						>
							Delete
						</StatusButton>
					</DialogFooter>
				</collectionDeleteFetcher.Form>
			</DialogContent>
		</Dialog>
	);
}
