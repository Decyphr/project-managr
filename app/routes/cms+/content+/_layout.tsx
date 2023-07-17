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
				slug: true,
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

	return (
		<div className="w-full">
			<div className="flex gap-8">
				<div className="w-[220px]">
					<Sidebar>
						<SideBarLink href="/cms/content/all">All Entries</SideBarLink>
						{collections.map(({ slug, title, id }) => (
							<SideBarLink key={id} href={id}>
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
