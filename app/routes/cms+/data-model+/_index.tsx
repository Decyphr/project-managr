import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { prisma } from '~/utils/db.server.ts';

export const loader = async ({}: DataFunctionArgs) => {
	const collections = await prisma.collection.findMany({
		select: {
			id: true,
			title: true,
			handle: true,
		},
	});

	return json({ collections });
};

export const action = async ({}: DataFunctionArgs) => {
	return redirect('');
};

export default function DataModel() {
	const { collections } = useLoaderData<typeof loader>();

	return (
		<div className="w-full">
			<ul>
				<li>
					<Link to="create">Create</Link>
				</li>
				{collections.map(({ id, title }) => (
					<li key={id}>
						<Link to={id}>{title}</Link>
					</li>
				))}
			</ul>
		</div>
	);
}
