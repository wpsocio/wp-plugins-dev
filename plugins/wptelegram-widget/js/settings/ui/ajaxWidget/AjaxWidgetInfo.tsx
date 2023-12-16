import { WidgetInfo } from '@wpsocio/components';
import { __ } from '@wpsocio/i18n';
import { useData } from '../../services';

export const AjaxWidgetInfo = () => {
	const { admin_url = '' } = useData('api');

	return (
		<WidgetInfo
			adminUrl={admin_url}
			phpCode={`if ( function_exists( 'wptelegram_ajax_widget' ) ) {\n\twptelegram_ajax_widget();\n}`}
			title={__('WP Telegram Ajax Widget')}
			shortcode1='[wptelegram-ajax-widget username="WPTelegram" width="100%" height="500px"]'
			shortcode2='[wptelegram-ajax-widget width="98%" height="700px"]'
		/>
	);
};
