import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { FilePlus2Icon } from 'lucide-react';
import { RouteTitle } from '~/components/cms/route-title.tsx';
import Sidebar from '~/components/cms/sidebar.tsx';
import { Button } from '~/components/ui/button.tsx';

export const loader = async ({}: DataFunctionArgs) => {
	return json({});
};

export const action = async ({}: DataFunctionArgs) => {
	return redirect('');
};

export default function ContentLayout() {
	const nav = [
		{
			title: 'All Content',
			href: '/cms/content',
		},
		{
			title: 'Pages',
			href: '/cms/content/pages',
		},
	];
	return (
		<div className="w-full">
			<RouteTitle title="Content">
				<div className="flex items-center space-x-2">
					<Button size="sm">
						<FilePlus2Icon className="mr-2 h-4 w-4" />
						New Entry
					</Button>
				</div>
			</RouteTitle>
			<div className="flex gap-8">
				<div className="w-[240px]">
					<Sidebar links={nav} />
				</div>
				<div className="w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
