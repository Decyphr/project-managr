import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, Outlet } from '@remix-run/react';
import { authenticator, getUserId } from '~/utils/auth.server.ts';
import { PrimaryNav } from '~/components/cms/primary-nav.tsx';
import { UserNav } from '~/components/cms/user-nav.tsx';
import { Sidebar, SideBarLink } from '~/components/cms/sidebar.tsx';
import {
	AvatarIcon,
	DashboardIcon,
	FileIcon,
	GearIcon,
	ImageIcon,
	Pencil2Icon,
	StackIcon,
} from '@radix-ui/react-icons';

export const loader = async ({ request }: DataFunctionArgs) => {
	const userId = await getUserId(request);
	if (!userId) {
		const requestUrl = new URL(request.url);
		const loginParams = new URLSearchParams([
			['redirectTo', `${requestUrl.pathname}${requestUrl.search}`],
		]);
		const redirectTo = `/login?${loginParams}`;
		await authenticator.logout(request, { redirectTo });
		return redirect(redirectTo);
	}

	return json({});
};

export default function CMSLayout() {
	const nav = [
		{
			title: 'Dashboard',
			href: '/cms/dashboard',
			icon: <DashboardIcon className="mr-2 h-5 w-5" />,
		},
		{
			title: 'Content',
			href: '/cms/content',
			icon: <Pencil2Icon className="mr-2 h-5 w-5" />,
		},
		{
			title: 'Media',
			href: '/cms/media',
			icon: <ImageIcon className="mr-2 h-5 w-5" />,
		},
		{
			title: 'Users',
			href: '/cms/users',
			icon: <AvatarIcon className="mr-2 h-5 w-5" />,
		},
		{
			title: 'Data Model',
			href: '/cms/data-model',
			icon: <StackIcon className="mr-2 h-5 w-5" />,
		},
		{
			title: 'Settings',
			href: '/cms/settings',
			icon: <GearIcon className="mr-2 h-5 w-5" />,
		},
	];

	return (
		<>
			<div className="hidden flex-col md:flex">
				<div className="fixed left-0 right-0 top-0 z-50 border-b border-violet-900 bg-secondary">
					<div className="flex h-16 items-center px-6">
						<Link to="/cms" className="flex h-full items-center">
							<span className="mr-2 rounded-sm border border-primary px-3 py-1 font-bold lowercase text-primary">
								m
							</span>
							A Really, Unneccesarily Long Site Title
						</Link>
						<div className="ml-auto flex items-center space-x-4">
							{/* <Search /> */}
							<UserNav />
						</div>
					</div>
				</div>
				<main className="mt-16 flex gap-8">
					<div className="fixed left-0 h-full w-[240px] bg-secondary p-6">
						<Sidebar>
							{nav.map(({ href, title, icon }) => (
								<SideBarLink href={href} key={title}>
									{icon}
									{title}
								</SideBarLink>
							))}
						</Sidebar>
					</div>
					<div className="ml-[240px] w-full p-6">
						<Outlet />
					</div>
				</main>
			</div>
		</>
	);
}
