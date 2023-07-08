import { Link, NavLink } from '@remix-run/react';
import { cn } from '~/utils/misc.ts';

export function PrimaryNav({
	className,
	...props
}: React.HTMLAttributes<HTMLElement>) {
	const navigation = [
		{ name: 'Dashboard', href: '/cms/dashboard' },
		{ name: 'Content', href: '/cms/content' },
		{ name: 'Media', href: '/cms/media' },
		{ name: 'Users', href: 'users' },
		{ name: 'Settings', href: 'settings' },
	];

	return (
		<nav
			className={cn('flex items-center space-x-2 lg:space-x-3', className)}
			{...props}
		>
			<Link
				to="/cms"
				className="rounded-sm border border-primary px-3 py-1 font-bold text-primary"
			>
				M
			</Link>
			{navigation.map((item, idx) => (
				<NavLink
					to={item.href}
					key={idx}
					className={({ isActive }) =>
						cn(
							'rounded-sm px-2 py-1 text-sm font-medium transition-colors hover:text-primary',
							isActive ? 'text-primary' : 'text-muted-foreground',
						)
					}
				>
					{item.name}
				</NavLink>
			))}
		</nav>
	);
}
