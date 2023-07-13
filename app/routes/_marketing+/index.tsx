import type { V2_MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button.tsx';

export const meta: V2_MetaFunction = () => [{ title: 'Homepage | Site Title' }];

export default function Index() {
	return (
		<main className="flex h-screen w-full flex-col items-center justify-center gap-8">
			<h1>Homepage</h1>
			<Button asChild>
				<Link to="/cms">Fast Travel to CMS</Link>
			</Button>
		</main>
	);
}
