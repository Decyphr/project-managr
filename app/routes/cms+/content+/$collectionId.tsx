import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server.ts';

export const loader = async ({ params }: DataFunctionArgs) => {
	invariant(params.collectionId, 'Missing id');
	try {
		const entries = await prisma.entry.findMany({
			where: { collectionId: params.collectionId },
		});
		return json({ entries });
	} catch (error) {
		console.log(error);
		throw json({ error: 'Unable to find collection entries' }, { status: 500 });
	}
};

export const action = async ({}: DataFunctionArgs) => {
	return redirect('');
};

export default function ContentUnique() {
	const { entries } = useLoaderData<typeof loader>();

	return (
		<div className="w-full">
			<h1>Content Unique</h1>
			<Link to="create">Create</Link>
			<ul>
				{entries.map(({ id, title }) => (
					<li key={id}>{title}</li>
				))}
			</ul>
		</div>
	);
}
