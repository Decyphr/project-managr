import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';

export const loader = async ({}: DataFunctionArgs) => {
	return redirect('/cms/dashboard');
};
