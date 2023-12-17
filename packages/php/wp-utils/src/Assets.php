<?php
/**
 * Handles the dependencies for the built assets.
 *
 * @link       https://wpsocio.com
 *
 * @package WPSocio\WPUtils
 */

namespace WPSocio\WPUtils;

/**
 * Easily access the dependencies for the built assets.
 *
 * @package    WPSocio\WPUtils
 * @author     WP Socio
 */
class Assets {

	const DEPS_FILE_NAME = 'dependencies.json';

	/**
	 * The path to assets directory.
	 *
	 * @var string $assets_path The path to assets directory.
	 */
	private $assets_path;

	/**
	 * The URL to assets directory.
	 *
	 * @var string $assets_url The URL to assets directory.
	 */
	private $assets_url;

	/**
	 * The decoded contents of the dependencies file.
	 *
	 * @var array $dependencies The decoded contents of the dependencies file.
	 */
	private $dependencies = null;

	/**
	 * The path to dependencies file.
	 *
	 * @var string $assets_path The path to dependencies file.
	 */
	private $dependencies_path;

	/**
	 * Assets constructor.
	 *
	 * @param string $assets_path The path to assets directory.
	 * @param string $assets_url  The URL to assets directory.
	 */
	public function __construct( $assets_path, $assets_url ) {
		$this->assets_path = untrailingslashit( $assets_path );
		$this->assets_url  = untrailingslashit( $assets_url );
		$this->initialize();
	}

	/**
	 * Initializes the assets.
	 *
	 * @return void
	 */
	public function initialize() {
		if ( ! $this->dependencies ) {
			$this->set_dependencies_filepath();
			$this->load_dependencies();
		}
	}

	/**
	 * Sets the path to dependencies file.
	 *
	 * @param string $dependencies_path Path to dependencies JSON file.
	 *
	 * @throws \Exception Dependencies file check.
	 *
	 * @return void
	 */
	public function set_dependencies_filepath( $dependencies_path = '' ) {
		$dependencies_path = $dependencies_path ? $dependencies_path : $this->build_path( '/' . self::DEPS_FILE_NAME );

		$this->dependencies_path = $dependencies_path;
	}

	/**
	 * Loads the dependencies file.
	 *
	 * @return void
	 */
	private function load_dependencies() {
		if ( null !== $this->dependencies ) {
			return;
		}

		if ( ! $this->dependencies_path || ! is_readable( $this->dependencies_path ) ) {
			// phpcs:ignore WordPress.PHP.DevelopmentFunctions.error_log_error_log
			error_log( 'Dependencies file not found or is not readable: ' . esc_html( $this->dependencies_path ) );

			$this->dependencies = [];

			return;
		}

		$dependencies = json_decode( file_get_contents( $this->dependencies_path ), true );

		$this->dependencies = $dependencies ? $dependencies : [];
	}

	/**
	 * Get the dependencies of an entry.
	 *
	 * @param string $entry The entry point to get the asset dependencies for.
	 *
	 * @return array
	 */
	public function get_dependencies( $entry ) {
		$dependencies = $this->dependencies[ $entry ] ?? [];

		return $dependencies;
	}

	/**
	 * Get the path to assets directory.
	 *
	 * @param string $path Path to append.
	 * @return string
	 */
	public function path( $path = '' ) {
		return $this->assets_path . $path;
	}

	/**
	 * Get the URL to assets directory.
	 *
	 * @param string $path Path to append.
	 * @return string
	 */
	public function url( $path = '' ) {
		return $this->assets_url . $path;
	}

	/**
	 * Get the build path.
	 *
	 * @param string $path Path to append.
	 * @return string
	 */
	public function build_path( $path = '' ) {
		return $this->path( '/build' . $path );
	}

	/**
	 * Get the build URL.
	 *
	 * @param string $path Path to append.
	 * @return string
	 */
	public function build_url( $path = '' ) {
		return $this->url( '/build' . $path );
	}
}
