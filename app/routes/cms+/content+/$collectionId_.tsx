import type { Entry } from '@prisma/client';
import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData, useParams } from '@remix-run/react';
import invariant from 'tiny-invariant';
import { prisma } from '~/utils/db.server.ts';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/cms/data-table/data-table-column-header.tsx';
import { DataTable } from '~/components/cms/data-table/data-table.tsx';
import { Checkbox } from '~/components/ui/checkbox.tsx';
import { RouteTitle } from '~/components/cms/route-title.tsx';
import { PlusIcon } from '@radix-ui/react-icons';
import { Button } from '~/components/ui/button.tsx';

export const loader = async ({ params }: DataFunctionArgs) => {
	invariant(params.collectionId, 'Missing id');

	try {
		let entries: Entry[] = [];

		if (params.collectionId === 'all') {
			entries = await prisma.entry.findMany();
		} else {
			entries = await prisma.entry.findMany({
				where: { collectionId: params.collectionId },
			});
		}
		return json({ entries });
	} catch (error) {
		console.log(error);
		throw json({ error: 'Unable to find collection entries' }, { status: 500 });
	}
};

export const action = async ({}: DataFunctionArgs) => {
	return redirect('');
};

const columns: ColumnDef<Pick<Entry, 'id' | 'title' | 'slug'>>[] = [
	{
		id: 'select',
		header: ({ table }) => (
			<Checkbox
				checked={table.getIsAllPageRowsSelected()}
				onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={value => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},
	{
		accessorKey: 'title',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Title" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<Link
						to={row.getValue('slug')}
						className="max-w-[500px] truncate font-medium"
					>
						{row.getValue('title')}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: 'slug',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Slug" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] truncate font-medium">
						{row.getValue('slug')}
					</span>
				</div>
			);
		},
	},
	/* {
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	}, */
];

export default function ContentUnique() {
	const { entries } = useLoaderData<typeof loader>();
	const params = useParams();

	const pageTitle =
		params?.collectionId === 'all' ? 'All Entries' : params.collectionId;

	return (
		<div className="w-full">
			{!pageTitle ? (
				<RouteTitle title="All entries" />
			) : (
				<RouteTitle title={pageTitle}>
					<Button asChild>
						<Link to="create">
							<PlusIcon className="mr-2 h-4 w-4" />
							New Entry
						</Link>
					</Button>
				</RouteTitle>
			)}
			<DataTable data={entries} columns={columns} />
		</div>
	);
}
