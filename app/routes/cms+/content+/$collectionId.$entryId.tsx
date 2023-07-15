import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { EntryEditor } from '~/routes/resources+/entry-editor.tsx';
import { prisma } from '~/utils/db.server.ts';

export const loader = async ({ params }: DataFunctionArgs) => {
	invariant(params.collectionId, 'Missing collectionId');
	invariant(params.entryId, 'Missing entryId');

	try {
		const entry = await prisma.entry.findFirst({
			where: { id: params.entryId },
		});

		if (!entry) {
			throw json({ error: 'Entry not found' }, { status: 404 });
		}

		return json({ collectionId: params.collectionId, entry });
	} catch (error) {
		console.error(error);
		throw json({ error: 'Error fetching entry' }, { status: 500 });
	}
};

export const action = async ({}: DataFunctionArgs) => {
	return redirect('');
};

export default function EditEntry() {
	const { collectionId, entry } = useLoaderData<typeof loader>();

	return <EntryEditor entry={entry} collectionId={collectionId} />;
}
