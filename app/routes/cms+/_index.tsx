import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { getUserId } from '~/utils/auth.server.ts';

export const loader = async ({ request }: DataFunctionArgs) => {
	const userId = await getUserId(request);
	if (!userId) {
		return redirect('/login');
	}
	return redirect('/cms/dashboard');
};
