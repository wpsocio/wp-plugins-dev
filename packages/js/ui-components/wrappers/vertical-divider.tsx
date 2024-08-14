import { type PropsWithChildren } from 'react';
import { Separator } from '../ui/separator.js';
import { cn } from '../lib/utils.js';

export type VerticalDividerProps = React.HTMLAttributes<HTMLDivElement> & {
	wrapperClassName?: string;
};

export const VerticalDivider: React.FC<PropsWithChildren<VerticalDividerProps>> = ({
	children,
	className,
	wrapperClassName,
	...props
}) => {
	const divider = <Separator orientation='vertical' className={cn('w-0 h-4 border', className)} {...props} />;

	return (
		<div className={cn('flex flex-col justify-center items-center', wrapperClassName)}>
			{divider}
			{children}
			{divider}
		</div>
	);
};
