<?php
/**
 * Plugin Name: Professional Blocks Suite
 * Plugin URI: https://github.com/gabidoet/professional-blocks-suite
 * Description: A comprehensive collection of 11 professional Gutenberg blocks for WordPress, including advanced heading, buttons, sliders, testimonials, and more.
 * Version: 1.0.0
 * Author: Professional Blocks Suite Team
 * Author URI: https://github.com/gabidoet/professional-blocks-suite
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain: professional-blocks-suite
 * Domain Path: /languages
 * Requires at least: 6.0
 * Tested up to: 6.4
 * Requires PHP: 7.4
 * Network: false
 * 
 * @package ProfessionalBlocksSuite
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

// Define plugin constants
define('PBS_VERSION', '1.0.0');
define('PBS_PLUGIN_FILE', __FILE__);
define('PBS_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('PBS_PLUGIN_URL', plugin_dir_url(__FILE__));
define('PBS_PLUGIN_BASENAME', plugin_basename(__FILE__));

/**
 * Main Professional Blocks Suite Class
 * 
 * @since 1.0.0
 */
final class ProfessionalBlocksSuite {
    
    /**
     * Plugin instance
     * 
     * @var ProfessionalBlocksSuite
     * @since 1.0.0
     */
    private static $instance = null;
    
    /**
     * Get plugin instance
     * 
     * @return ProfessionalBlocksSuite
     * @since 1.0.0
     */
    public static function get_instance() {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        return self::$instance;
    }
    
    /**
     * Constructor
     * 
     * @since 1.0.0
     */
    private function __construct() {
        $this->init_hooks();
        $this->load_dependencies();
    }
    
    /**
     * Initialize hooks
     * 
     * @since 1.0.0
     */
    private function init_hooks() {
        add_action('init', array($this, 'init'));
        add_action('plugins_loaded', array($this, 'load_textdomain'));
        
        // Activation and deactivation hooks
        register_activation_hook(PBS_PLUGIN_FILE, array($this, 'activate'));
        register_deactivation_hook(PBS_PLUGIN_FILE, array($this, 'deactivate'));
    }
    
    /**
     * Load plugin dependencies
     * 
     * @since 1.0.0
     */
    private function load_dependencies() {
        require_once PBS_PLUGIN_DIR . 'includes/class-block-manager.php';
        require_once PBS_PLUGIN_DIR . 'includes/class-assets-manager.php';
    }
    
    /**
     * Initialize plugin
     * 
     * @since 1.0.0
     */
    public function init() {
        // Check if Gutenberg is available
        if (!function_exists('register_block_type')) {
            add_action('admin_notices', array($this, 'gutenberg_notice'));
            return;
        }
        
        // Initialize managers
        PBS_Block_Manager::get_instance();
        PBS_Assets_Manager::get_instance();
        
        // Add block category
        add_filter('block_categories_all', array($this, 'add_block_category'), 10, 2);
    }
    
    /**
     * Load plugin textdomain
     * 
     * @since 1.0.0
     */
    public function load_textdomain() {
        load_plugin_textdomain(
            'professional-blocks-suite',
            false,
            dirname(PBS_PLUGIN_BASENAME) . '/languages'
        );
    }
    
    /**
     * Add custom block category
     * 
     * @param array $categories Existing categories
     * @param WP_Post $post Current post
     * @return array Modified categories
     * @since 1.0.0
     */
    public function add_block_category($categories, $post) {
        return array_merge(
            array(
                array(
                    'slug'  => 'professional-blocks-suite',
                    'title' => __('Professional Blocks Suite', 'professional-blocks-suite'),
                    'icon'  => 'star-filled',
                ),
            ),
            $categories
        );
    }
    
    /**
     * Show Gutenberg requirement notice
     * 
     * @since 1.0.0
     */
    public function gutenberg_notice() {
        ?>
        <div class="notice notice-error">
            <p>
                <?php
                printf(
                    /* translators: %s: Plugin name */
                    esc_html__('%s requires the Gutenberg editor to be active.', 'professional-blocks-suite'),
                    '<strong>' . esc_html__('Professional Blocks Suite', 'professional-blocks-suite') . '</strong>'
                );
                ?>
            </p>
        </div>
        <?php
    }
    
    /**
     * Plugin activation
     * 
     * @since 1.0.0
     */
    public function activate() {
        // Check WordPress version
        if (version_compare(get_bloginfo('version'), '6.0', '<')) {
            deactivate_plugins(PBS_PLUGIN_BASENAME);
            wp_die(
                esc_html__('Professional Blocks Suite requires WordPress 6.0 or higher.', 'professional-blocks-suite'),
                esc_html__('Plugin Activation Error', 'professional-blocks-suite'),
                array('back_link' => true)
            );
        }
        
        // Check PHP version
        if (version_compare(PHP_VERSION, '7.4', '<')) {
            deactivate_plugins(PBS_PLUGIN_BASENAME);
            wp_die(
                esc_html__('Professional Blocks Suite requires PHP 7.4 or higher.', 'professional-blocks-suite'),
                esc_html__('Plugin Activation Error', 'professional-blocks-suite'),
                array('back_link' => true)
            );
        }
        
        // Set activation flag
        update_option('pbs_activated', true);
        
        // Clear any cached data
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }
    }
    
    /**
     * Plugin deactivation
     * 
     * @since 1.0.0
     */
    public function deactivate() {
        // Clear activation flag
        delete_option('pbs_activated');
        
        // Clear any cached data
        if (function_exists('wp_cache_flush')) {
            wp_cache_flush();
        }
    }
    
    /**
     * Get plugin version
     * 
     * @return string
     * @since 1.0.0
     */
    public function get_version() {
        return PBS_VERSION;
    }
    
    /**
     * Get plugin directory path
     * 
     * @return string
     * @since 1.0.0
     */
    public function get_plugin_dir() {
        return PBS_PLUGIN_DIR;
    }
    
    /**
     * Get plugin directory URL
     * 
     * @return string
     * @since 1.0.0
     */
    public function get_plugin_url() {
        return PBS_PLUGIN_URL;
    }
}

/**
 * Initialize the plugin
 * 
 * @return ProfessionalBlocksSuite
 * @since 1.0.0
 */
function pbs() {
    return ProfessionalBlocksSuite::get_instance();
}

// Initialize the plugin
pbs();

