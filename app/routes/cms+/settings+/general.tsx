import type { DataFunctionArgs } from '@remix-run/node';
import { json, redirect } from '@remix-run/node';

export const loader = async ({}: DataFunctionArgs) => {
	return json({});
};

export const action = async ({}: DataFunctionArgs) => {
	return redirect('');
};

export default function GeneralSettingsPage() {
	return <h2>General Settings</h2>;
}
