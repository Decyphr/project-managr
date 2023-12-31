import type { DataFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import { EntryEditor } from '~/routes/resources+/entry-editor.tsx';

export const loader = async ({ params }: DataFunctionArgs) => {
	const { collectionId } = params;

	if (!collectionId) {
		throw json({ error: 'Missing collectionId' }, { status: 400 });
	}

	return json({ collectionId });
};

export default function CreateCollectionEntry() {
	const { collectionId } = useLoaderData<typeof loader>();

	return <EntryEditor collectionId={collectionId} />;
}
