import $ from 'jquery';

import { setLocaleData } from '@wpsocio/i18n';

import type { Plugins } from './types';

export const cleanup = (removeSiblingsOf = '', disableFormCSS = true) => {
	const id = removeSiblingsOf?.replace(/^#?/, '#');
	$(() => {
		if (id && $(id).length) {
			$(id).siblings().remove();
		}
		if (disableFormCSS) {
			$('#forms-css').prop('disabled', true);
		}
	});
};

export const setI18nData = (plugin: keyof Plugins, domain: string) => {
	//@ts-ignore
	const i18nData = window[plugin].i18n;
	setLocaleData(i18nData, domain);
};
