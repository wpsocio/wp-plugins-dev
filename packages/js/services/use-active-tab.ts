import { useCallback, useMemo } from 'react';
import { useLocalStorage } from './use-local-storage';

export interface ActiveTab {
	getActiveTab: (defaultValue: string) => string;
	setActiveTab: (newTab: string) => void;
}

const DEFAULT_KEY = 'mainActiveTab';

export const useActiveTab = (
	plugin: string,
	tabKey = DEFAULT_KEY,
): ActiveTab => {
	const { getItem, setItem } = useLocalStorage(plugin, {});

	const getActiveTab = useCallback<ActiveTab['getActiveTab']>(
		(defaultValue) => getItem(tabKey, defaultValue),
		[getItem, tabKey],
	);

	const setActiveTab = useCallback<ActiveTab['setActiveTab']>(
		(newTab) => setItem(tabKey, newTab),
		[setItem, tabKey],
	);

	return useMemo(
		() => ({
			getActiveTab,
			setActiveTab,
		}),
		[getActiveTab, setActiveTab],
	);
};
