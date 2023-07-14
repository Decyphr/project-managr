import { Link, useLocation } from '@remix-run/react';
import { Button } from '~/components/ui/button.tsx';
import { Separator } from '~/components/ui/separator.tsx';

type RouteTitleProps = {
	title: string;
	showBreadcrumbs?: boolean;
	children?: React.ReactNode;
};

const RouteTitle = ({ title, showBreadcrumbs, children }: RouteTitleProps) => {
	const { pathname } = useLocation();

	const breadcrumbs = pathname.split('/');

	const backLink =
		breadcrumbs.length > 1
			? {
					label: breadcrumbs[breadcrumbs.length - 2].replace(/[^\w\s]/gi, ' '),
					href: breadcrumbs.slice(0, -1).join('/'),
			  }
			: {};

	return (
		<>
			<div className="flex items-center justify-between">
				<div className="space-y-2">
					<h2>{title}</h2>
					{showBreadcrumbs ? (
						<div className="divide-x-2">
							{backLink.href ? (
								<Link to={backLink.href} className="capitalize hover:underline">
									{backLink.label}
								</Link>
							) : null}
						</div>
					) : null}
				</div>
				<div className="flex space-x-4">{children}</div>
			</div>
			<Separator className="my-6" />
		</>
	);
};

export { RouteTitle };
