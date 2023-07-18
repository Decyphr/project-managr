import { PlusIcon } from '@radix-ui/react-icons';
import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { RouteTitle } from '~/components/cms/route-title.tsx';
import { Button } from '~/components/ui/button.tsx';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '~/components/ui/table.tsx';
import { DeleteCollection } from '~/routes/resources+/collection-delete.tsx';
import { prisma } from '~/utils/db.server.ts';

export const loader = async () => {
	const collections = await prisma.collection.findMany({
		select: {
			id: true,
			title: true,
			slug: true,
			handle: true,
			description: true,
		},
	});

	return json({ collections });
};

export default function DataModel() {
	const { collections } = useLoaderData<typeof loader>();

	return (
		<div className="w-full">
			<RouteTitle title="Collections">
				<Button asChild>
					<Link to="create">
						<PlusIcon className="mr-2 h-4 w-4" />
						Create Collection
					</Link>
				</Button>
			</RouteTitle>
			<Table>
				<TableHeader>
					<TableRow>
						<TableHead>Title</TableHead>
						<TableHead>Description</TableHead>
						<TableHead>Slug</TableHead>
						<TableHead>Handle</TableHead>
						<TableHead>Delete?</TableHead>
					</TableRow>
				</TableHeader>
				<TableBody>
					{collections.map(collection => (
						<TableRow key={collection.id}>
							<TableCell className="font-medium">
								<Link to={collection.id} className="hover:underline">
									{collection.title}
								</Link>
							</TableCell>
							<TableCell>{collection.description}</TableCell>
							<TableCell>{collection.slug}</TableCell>
							<TableCell>{collection.handle}</TableCell>
							<TableCell>
								<DeleteCollection collection={collection} />
							</TableCell>
						</TableRow>
					))}
				</TableBody>
			</Table>
		</div>
	);
}
