import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { RouteTitle } from '~/components/cms/route-title.tsx';
import { SideBarLink, Sidebar } from '~/components/cms/sidebar.tsx';

export const loader = async ({}: DataFunctionArgs) => {
	return json({});
};

export const action = async ({}: DataFunctionArgs) => {
	return redirect('');
};

export default function SettingsPage() {
	const nav = [
		{
			title: 'General',
			href: 'general',
		},
		{
			title: 'Data Model',
			href: 'data-model',
		},
		{
			title: 'Migrations',
			href: 'migrations',
		},
	];
	return (
		<div className="w-full">
			<div className="flex gap-8">
				<div className="w-[240px]">
					<Sidebar>
						{nav.map(({ title, href }) => (
							<SideBarLink key={href} href={href}>
								{title}
							</SideBarLink>
						))}
					</Sidebar>
				</div>
				<div className="w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
