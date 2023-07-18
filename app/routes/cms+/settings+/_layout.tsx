import { Outlet } from '@remix-run/react';
import { SideBarLink, Sidebar } from '~/components/cms/sidebar.tsx';

export default function SettingsPage() {
	const nav = [
		{
			title: 'General',
			href: 'general',
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
