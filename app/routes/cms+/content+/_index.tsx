import { Entry } from '@prisma/client';
import { PlusIcon } from '@radix-ui/react-icons';
import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, Outlet, useLoaderData } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/cms/data-table/data-table-column-header.tsx';
import { DataTable } from '~/components/cms/data-table/data-table.tsx';
import { RouteTitle } from '~/components/cms/route-title.tsx';
import { SideBarLink, Sidebar } from '~/components/cms/sidebar.tsx';
import { Button } from '~/components/ui/button.tsx';
import { Checkbox } from '~/components/ui/checkbox.tsx';
import { prisma } from '~/utils/db.server.ts';

export const loader = async ({}: DataFunctionArgs) => {
	const entries = await prisma.entry.findMany({
		select: {
			id: true,
			title: true,
			slug: true,
		},
	});

	return json({ entries });
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

export default function ContentPage() {
	const { entries } = useLoaderData<typeof loader>();

	return (
		<div className="w-full">
			<RouteTitle title="Content">
				<Button>
					<PlusIcon className="h-4 w-4" />
					<span className="ml-2">New Entry</span>
				</Button>
			</RouteTitle>
			<div className="flex gap-8">
				<div className="w-full">
					<DataTable data={entries} columns={columns} />
				</div>
			</div>
		</div>
	);
}
