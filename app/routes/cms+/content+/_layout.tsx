import type { DataFunctionArgs } from '@remix-run/node';
import { json } from '@remix-run/node';
import { Outlet, useLoaderData } from '@remix-run/react';
import { SideBarLink, Sidebar } from '~/components/cms/sidebar.tsx';
import { prisma } from '~/utils/db.server.ts';

export const loader = async ({}: DataFunctionArgs) => {
	try {
		const collections = await prisma.collection.findMany({
			select: {
				id: true,
				title: true,
			},
		});

		return json({ collections });
	} catch (error) {
		console.error(error);
		throw json({ error: 'Unable to fetch collections' }, { status: 500 });
	}
};

export default function ContentLayout() {
	const { collections } = useLoaderData<typeof loader>();

	const nav = collections.map(({ id, title }) => ({
		href: id,
		title,
	}));

	return (
		<div className="w-full">
			<div className="flex gap-8">
				<div className="w-[180px]">
					<Sidebar>
						<SideBarLink href="/cms/content">All Entries</SideBarLink>
						{nav.map(({ href, title }) => (
							<SideBarLink key={title} href={href}>
								{title}
							</SideBarLink>
						))}
					</Sidebar>
				</div>
				<div className="w-full">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
