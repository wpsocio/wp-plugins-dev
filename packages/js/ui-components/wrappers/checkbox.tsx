import { forwardRef, useId } from 'react';
import { cn } from '../lib/utils.js';
import { Checkbox as CheckboxUI } from '../ui/checkbox.js';
import { Label } from './label.js';

export type CheckboxProps = React.ComponentProps<typeof CheckboxUI> & {
	description?: React.ReactNode;
	wrapperClassName?: string;
};

export const Checkbox = forwardRef<HTMLButtonElement, CheckboxProps>(
	({ children, description, id, wrapperClassName, ...props }, ref) => {
		const defaultId = useId();
		const inputId = id || defaultId;

		return (
			<div className={cn('items-top flex space-x-2', wrapperClassName)}>
				<CheckboxUI ref={ref} id={inputId} {...props} />
				<div className="grid gap-1.5 leading-none">
					<Label
						htmlFor={inputId}
						className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
					>
						{children}
					</Label>
					{description}
				</div>
			</div>
		);
	},
);

Checkbox.displayName = 'Checkbox';
