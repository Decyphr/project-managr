import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { Outlet } from '@remix-run/react';
import { authenticator, getUserId } from '~/utils/auth.server.ts';
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
	return (
		<>
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
				<main className="flex flex-1 gap-8 space-y-4 p-8 pt-6">
					<Outlet />
				</main>
			</div>
		</>
	);
}
