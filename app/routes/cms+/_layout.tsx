import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Form, Link, Outlet, useSubmit } from '@remix-run/react';
import { Button } from '~/components/ui/button.tsx';
import { authenticator, getUserId } from '~/utils/auth.server.ts';
import { useUser } from '~/utils/user.ts';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuPortal,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu.tsx';
import { useRef } from 'react';
import { getUserImgSrc } from '~/utils/misc.ts';
import { Icon } from '~/components/ui/icon.tsx';
import { PrimaryNav } from '~/components/cms/primary-nav.tsx';
import { UserNav } from '~/components/cms/user-nav.tsx';

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
	const user = useUser();

	return (
		<>
			<div className="md:hidden">
				<img
					src="https://via.placeholder.com/1280x866"
					width={1280}
					height={866}
					alt="Dashboard"
					className="block dark:hidden"
				/>
				<img
					src="https://via.placeholder.com/1280x866"
					width={1280}
					height={866}
					alt="Dashboard"
					className="hidden dark:block"
				/>
			</div>
			<div className="hidden flex-col md:flex">
				<div className="border-b">
					<div className="flex h-16 items-center px-4">
						<PrimaryNav className="mx-6" />
						<div className="ml-auto flex items-center space-x-4">
							{/* <Search /> */}
							<UserNav />
						</div>
					</div>
				</div>
				<main className="flex-1 space-y-4 p-8 pt-6">
					<Outlet />
				</main>
			</div>
		</>
	);
}
