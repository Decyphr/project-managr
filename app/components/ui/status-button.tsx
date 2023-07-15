import * as React from 'react';
import { Button, type ButtonProps } from './button.tsx';
import { cn } from '~/utils/misc.ts';
import { CheckIcon, Cross2Icon } from '@radix-ui/react-icons';

export const StatusButton = React.forwardRef<
	HTMLButtonElement,
	ButtonProps & { status?: 'pending' | 'success' | 'error' | 'idle' }
>(({ status = 'idle', className, children, ...props }, ref) => {
	const companion = {
		pending: <CheckIcon className="h-4 w-4 animate-spin" />,
		success: <CheckIcon className="h-4 w-4" />,
		error: <Cross2Icon className="h-4 w-4" />,
		idle: null,
	}[status];
	return (
		<Button
			ref={ref}
			className={cn('flex justify-center gap-4', className)}
			{...props}
		>
			<div>{children}</div>
			{companion}
		</Button>
	);
});
StatusButton.displayName = 'Button';
