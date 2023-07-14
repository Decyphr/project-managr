import { Form, Link, useSubmit } from '@remix-run/react';
import { useRef } from 'react';
import {
	Avatar,
	AvatarFallback,
	AvatarImage,
} from '~/components/ui/avatar.tsx';
import { Button } from '~/components/ui/button.tsx';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu.tsx';
import { useUser } from '~/utils/user.ts';
import { Icon } from '../ui/icon.tsx';
import { getUserImgSrc } from '~/utils/misc.ts';

export function UserNav() {
	const user = useUser();
	const submit = useSubmit();
	const formRef = useRef<HTMLFormElement>(null);

	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="relative h-8 w-8 rounded-full">
					<Avatar className="h-8 w-8">
						<AvatarImage
							alt={user.name ?? user.username}
							src={getUserImgSrc(user.imageId)}
						/>
						<AvatarFallback className="uppercase">
							{user.username.charAt(0)}
						</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuItem className="cursor-pointer font-normal" asChild>
					<Link
						to={`/cms/users/${user.username}`}
						className="flex w-full flex-col items-start justify-start space-y-1"
					>
						<p className="text-sm font-medium leading-none">
							{user.name ?? user.username}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</Link>
				</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem asChild>
					<Form
						action="/logout"
						method="POST"
						ref={formRef}
						className="cursor-pointer"
					>
						<Icon className="text-body-md" name="exit">
							<button type="submit">Logout</button>
						</Icon>
					</Form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
