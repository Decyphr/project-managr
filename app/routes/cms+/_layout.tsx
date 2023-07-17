import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Link, Outlet } from '@remix-run/react';
import { authenticator, getUserId } from '~/utils/auth.server.ts';
import { UserNav } from '~/components/cms/user-nav.tsx';
import { Sidebar, SideBarLink } from '~/components/cms/sidebar.tsx';
import {
	AvatarIcon,
	DashboardIcon,
	GearIcon,
	ImageIcon,
	Pencil2Icon,
	StackIcon,
} from '@radix-ui/react-icons';
import { prisma } from '~/utils/db.server.ts';

export const loader = async ({ request }: DataFunctionArgs) => {
	const hasUsers = await prisma.user.count();
	if (!hasUsers) {
		return redirect('/setup-admin');
	}

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
			icon: <DashboardIcon className="h-5 w-5" />,
		},
		{
			title: 'Content',
			href: '/cms/content',
			icon: <Pencil2Icon className="h-5 w-5" />,
		},
		{
			title: 'Media',
			href: '/cms/media',
			icon: <ImageIcon className="h-5 w-5" />,
		},
		{
			title: 'Users',
			href: '/cms/users',
			icon: <AvatarIcon className="h-5 w-5" />,
		},
		{
			title: 'Data Model',
			href: '/cms/data-model',
			icon: <StackIcon className="h-5 w-5" />,
		},
		{
			title: 'Settings',
			href: '/cms/settings',
			icon: <GearIcon className="h-5 w-5" />,
		},
	];

	return (
		<>
			<div className="hidden flex-col md:flex">
				<div className="fixed left-0 right-0 top-0 z-50 border-b border-foreground/10">
					<div className="flex h-16 items-center">
						<Link
							to="/cms"
							className="flex h-full items-center justify-center border-r border-foreground/10 bg-foreground p-6 text-center font-bold text-background transition-colors ease-in-out hover:bg-foreground/90"
						>
							<span className="h-5 w-5">M</span>
						</Link>
						<div className="ml-auto flex items-center space-x-4 px-6">
							{/* <Search /> */}
							<UserNav />
						</div>
					</div>
				</div>
				<main className="mt-16 flex gap-8">
					<div className="fixed left-0 h-full border-r border-foreground/10 bg-foreground/10 p-4">
						<Sidebar>
							{nav.map(({ href, title, icon }) => (
								<SideBarLink href={href} key={title}>
									{icon}
								</SideBarLink>
							))}
						</Sidebar>
					</div>
					<div className="ml-16 w-full p-4">
						<Outlet />
					</div>
				</main>
			</div>
		</>
	);
}
