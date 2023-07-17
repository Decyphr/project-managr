import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';
import { RouteTitle } from '~/components/cms/route-title.tsx';

export const loader = async ({}: DataFunctionArgs) => {
	return json({});
};

export const action = async ({}: DataFunctionArgs) => {
	return redirect('');
};

export default function DashboardPage() {
	return <RouteTitle title="Dashboard" />;
}
