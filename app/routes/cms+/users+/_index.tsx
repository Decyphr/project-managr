import type { DataFunctionArgs } from '@remix-run/node';
import type { ColumnDef } from '@tanstack/react-table';
import type { Role, User } from '@prisma/client';

import { json } from '@remix-run/node';
import { Link, useLoaderData } from '@remix-run/react';
import { DataTable } from '~/components/cms/data-table/data-table.tsx';
import { prisma } from '~/utils/db.server.ts';

import { Checkbox } from '~/components/ui/checkbox.tsx';

import { DataTableColumnHeader } from '~/components/cms/data-table/data-table-column-header.tsx';
import { Sidebar, SideBarLink } from '~/components/cms/sidebar.tsx';
import { RouteTitle } from '~/components/cms/route-title.tsx';
import { Button } from '~/components/ui/button.tsx';
import { PlusIcon } from '@radix-ui/react-icons';
import { DataTableRowActions } from '~/components/cms/data-table/data-table-row-actions.tsx';

export const loader = async ({}: DataFunctionArgs) => {
	const users = await prisma.user.findMany({
		select: {
			id: true,
			name: true,
			username: true,
			email: true,
			roles: { select: { name: true } },
		},
	});

	return json({ users });
};

const columns: ColumnDef<Pick<User, 'id' | 'name' | 'username' | 'email'>>[] = [
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
		accessorKey: 'username',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Username" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<Link
						to={row.getValue('username')}
						className="max-w-[500px] truncate font-medium"
					>
						{row.getValue('username')}
					</Link>
				</div>
			);
		},
	},
	{
		accessorKey: 'name',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Name" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex space-x-2">
					<span className="max-w-[500px] truncate font-medium">
						{row.getValue('name')}
					</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'email',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Email" />
		),
		cell: ({ row }) => {
			return (
				<div className="flex w-[100px] items-center">
					<span>{row.getValue('email')}</span>
				</div>
			);
		},
	},
	{
		accessorKey: 'roles',
		header: ({ column }) => (
			<DataTableColumnHeader column={column} title="Role" />
		),
		cell: ({ row }) => {
			const roles: Role[] = row.getValue('roles');

			return (
				<div className="flex w-[100px] items-center">
					<span>{roles.length ? roles[0].name : ''}</span>
				</div>
			);
		},
	},
	/* {
		id: 'actions',
		cell: ({ row }) => <DataTableRowActions row={row} />,
	}, */
];

export default function UsersPage() {
	const { users } = useLoaderData<typeof loader>();

	return (
		<div className="w-full">
			<RouteTitle title="Users">
				<Button>
					<PlusIcon className="h-4 w-4" />
					<span className="ml-2">New User</span>
				</Button>
			</RouteTitle>
			<div className="flex gap-8">
				<div className="w-full">
					<DataTable data={users} columns={columns} />
				</div>
			</div>
		</div>
	);
}
