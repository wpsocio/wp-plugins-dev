import { InspectorControls } from '@wordpress/block-editor';
import type { BlockEditProps } from '@wordpress/blocks';
import {
	PanelBody,
	RadioControl,
	SelectControl,
	TextControl,
	ToggleControl,
} from '@wordpress/components';
import { useCallback, useEffect } from '@wordpress/element';

import { __ } from '@wpsocio/i18n';

import { Output } from './Output';
import type { TelegramLoginAtts } from './types';
import { useData } from './useData';

const getButtonStyleOptions = () => [
	{ label: __('Large'), value: 'large' },
	{ label: __('Medium'), value: 'medium' },
	{ label: __('Small'), value: 'small' },
];

const savedSettings = (window.wptelegram_login?.savedSettings ||
	{}) as TelegramLoginAtts;

export const Edit: React.FC<BlockEditProps<TelegramLoginAtts>> = ({
	attributes,
	setAttributes,
	className,
}) => {
	const {
		button_style,
		show_user_photo,
		corner_radius,
		lang,
		show_if_user_is,
	} = { ...savedSettings, ...attributes };

	useEffect(() => {
		for (const key in savedSettings) {
			if (!(key in attributes)) {
				setAttributes({ [key]: savedSettings[key as keyof TelegramLoginAtts] });
			}
		}
	}, []);

	const uiData = useData('uiData');

	const onChangeButtonStyle = useCallback(
		(newStyle: string) => setAttributes({ button_style: newStyle }),
		[setAttributes],
	);
	const onChangeShowUserPhoto = useCallback(
		(new_show_user_photo: boolean) =>
			setAttributes({ show_user_photo: new_show_user_photo }),
		[setAttributes],
	);
	const onChangeCornerRadius = useCallback(
		(newRadius: string) => setAttributes({ corner_radius: newRadius }),
		[setAttributes],
	);
	const onChangeShowIfUserIs = useCallback(
		(value: string) => setAttributes({ show_if_user_is: value }),
		[setAttributes],
	);

	const onChangeLang = useCallback(
		(value: string) => setAttributes({ lang: value }),
		[setAttributes],
	);

	return (
		<>
			<InspectorControls>
				<PanelBody title={__('Button Settings')}>
					<RadioControl
						label={__('Button Style')}
						selected={button_style}
						onChange={onChangeButtonStyle}
						options={getButtonStyleOptions()}
					/>
					<ToggleControl
						label={__('Show User Photo')}
						checked={show_user_photo}
						onChange={onChangeShowUserPhoto}
					/>
					<TextControl
						label={__('Corner Radius')}
						value={corner_radius || ''}
						onChange={onChangeCornerRadius}
						type="number"
						min="0"
						max="20"
					/>
					<SelectControl
						label={__('Language')}
						value={lang}
						onChange={onChangeLang}
						options={uiData.lang}
					/>
					<SelectControl
						label={__('Show if user is')}
						value={show_if_user_is}
						onChange={onChangeShowIfUserIs}
						options={uiData.show_if_user_is}
					/>
				</PanelBody>
			</InspectorControls>
			<Output attributes={attributes} className={className} />
		</>
	);
};
