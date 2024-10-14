// biome-ignore lint/suspicious/noExplicitAny: <explanation>
export interface AnyObject<T = any> {
	[key: string]: T;
}

export type ParseMode = 'HTML' | 'none';

export type UpdateMethod = 'webhook' | 'long_polling' | 'none';

export type BotInstance = {
	bot_token: string;
	bot_username: string;
	update_method: UpdateMethod;
};

export type MessageButton = {
	id?: string;
	label: string;
	value?: string;
	type: 'url' | 'reaction' | 'login_url' | 'web_app';
};

export type ChatIdParts = {
	chat_id: string;
	thread_id?: string;
	note?: string;
};
