import { Form, useSubmit } from '@remix-run/react';
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
						<AvatarFallback>SC</AvatarFallback>
					</Avatar>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent className="w-56" align="end" forceMount>
				<DropdownMenuLabel className="font-normal">
					<div className="flex flex-col space-y-1">
						<p className="text-sm font-medium leading-none">
							{user.name ?? user.username}
						</p>
						<p className="text-xs leading-none text-muted-foreground">
							{user.email}
						</p>
					</div>
				</DropdownMenuLabel>
				<DropdownMenuSeparator />
				<DropdownMenuGroup>
					<DropdownMenuItem>
						Profile
						<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Billing
						<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>
						Settings
						<DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
					</DropdownMenuItem>
					<DropdownMenuItem>New Team</DropdownMenuItem>
				</DropdownMenuGroup>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					asChild
					// this prevents the menu from closing before the form submission is completed
					onSelect={event => {
						event.preventDefault();
						submit(formRef.current);
					}}
				>
					<Form action="/logout" method="POST" ref={formRef}>
						<Icon className="text-body-md" name="exit">
							<button type="submit">Logout</button>
						</Icon>
					</Form>
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
