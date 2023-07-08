import type { V2_MetaFunction } from '@remix-run/node';
import { Link } from '@remix-run/react';
import { Button } from '~/components/ui/button.tsx';

export const meta: V2_MetaFunction = () => [{ title: 'Homepage | Site Title' }];

export default function Index() {
	return (
		<main>
			<h1>Homepage</h1>
			<Link to="/cms">
				<Button>Fast Travel to CMS</Button>
			</Link>
		</main>
	);
}
