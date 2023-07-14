import type { DataFunctionArgs } from '@remix-run/node';
import { Entry } from '@prisma/client';
import { json, redirect } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { ColumnDef } from '@tanstack/react-table';
import { DataTableColumnHeader } from '~/components/cms/data-table/data-table-column-header.tsx';
import { DataTable } from '~/components/cms/data-table/data-table.tsx';
import { Checkbox } from '~/components/ui/checkbox.tsx';
import { prisma } from '~/utils/db.server.ts';

export const loader = async ({}: DataFunctionArgs) => {
	try {
		const entries = await prisma.entry.findMany({
			select: {
				id: true,
				title: true,
				slug: true,
			},
		});

		return json({ entries });
	} catch (error) {
		console.error(error);
		throw json({ error: 'Unable to fetch content' }, { status: 500 });
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

export default function ContentPage() {
	const { entries } = useLoaderData<typeof loader>();

	return <DataTable data={entries} columns={columns} />;
}
