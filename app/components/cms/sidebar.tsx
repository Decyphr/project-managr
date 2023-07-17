import { NavLink } from '@remix-run/react';
import { PropsWithChildren } from 'react';
import { cn } from '~/utils/misc.ts';

const Sidebar = ({ children }: PropsWithChildren) => {
	return (
		<nav className="hidden md:block">
			<ul className="space-y-2" role="list">
				{children}
			</ul>
		</nav>
	);
};

const SideBarLink = ({
	href,
	children,
}: {
	href: string;
	children: React.ReactNode;
}) => {
	const baseClass =
		'text-sm flex-1 rounded-sm font-light transition-colors py-2 px-2 focus:bg-foreground focus:text-background';
	const linkClass =
		'text-primary/80 hover:text-foreground hover:bg-foreground/10';

	const activeLinkClass = 'text-background bg-foreground';

	return (
		<li className="relative flex">
			<NavLink
				to={href}
				className={({ isActive }) =>
					cn(baseClass, isActive ? activeLinkClass : linkClass)
				}
				prefetch="intent"
			>
				<span className="flex items-center justify-start">{children}</span>
			</NavLink>
		</li>
	);
};

export { Sidebar, SideBarLink };
