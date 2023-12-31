import type { DataFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';

import { RouteTitle } from '~/components/cms/route-title.tsx';
import { CollectionEditor } from '~/routes/resources+/collection-editor.tsx';
import { prisma } from '~/utils/db.server.ts';

export const loader = async ({ params }: DataFunctionArgs) => {
	invariant(params.id, 'Missing id');

	try {
		const collection = await prisma.collection.findUnique({
			where: {
				id: params.id,
			},
		});

		if (!collection) {
			throw json({ error: 'Unable to find collection' }, { status: 404 });
		}

		return json({ collection });
	} catch (error) {
		console.log(error);
		throw json({ error: 'Unable to find collection' }, { status: 500 });
	}
};

export default function EditDataModel() {
	const { collection } = useLoaderData<typeof loader>();

	return (
		<div className="w-full">
			<RouteTitle title={collection.title} />
			<CollectionEditor collection={collection} />
		</div>
	);
}
