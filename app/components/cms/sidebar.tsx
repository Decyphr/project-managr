import { NavLink } from '@remix-run/react';
import { FilesIcon, ImageIcon, SettingsIcon, UsersIcon } from 'lucide-react';
import { cn } from '~/utils/misc.ts';

const linkIconClass = 'w-5 h-5 mr-2';

type SidebarProps = {
	links: Array<{ href: string; title: string }>;
};

const Sidebar = ({ links }: SidebarProps) => {
	return (
		<nav className="hidden lg:block">
			<ul className="space-y-2" role="list">
				{/* Any Auxiliary Nav Links can go here for mobile */}
				{links.map(({ href, title }) => (
					<SideBarLink href={href} key={title}>
						<FilesIcon className={linkIconClass} />
						{title}
					</SideBarLink>
				))}
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
		'flex-1 rounded-sm font-light transition-colors py-1 px-2 focus:bg-foreground focus:text-background';
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
			>
				<span className="flex items-center justify-start">{children}</span>
			</NavLink>
		</li>
	);
};

export default Sidebar;
