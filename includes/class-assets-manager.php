<?php
/**
 * Assets Manager Class
 * 
 * Handles enqueuing of scripts and styles
 * 
 * @package ProfessionalBlocksSuite
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * PBS Assets Manager Class
 * 
 * @since 1.0.0
 */
class PBS_Assets_Manager {
    
    /**
     * Instance of this class
     * 
     * @var PBS_Assets_Manager
     * @since 1.0.0
     */
    private static $instance = null;
    
    /**
     * Get instance
     * 
     * @return PBS_Assets_Manager
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
    }
    
    /**
     * Initialize hooks
     * 
     * @since 1.0.0
     */
    private function init_hooks() {
        add_action('enqueue_block_editor_assets', array($this, 'enqueue_editor_assets'));
        add_action('wp_enqueue_scripts', array($this, 'enqueue_frontend_assets'));
        add_action('enqueue_block_assets', array($this, 'enqueue_block_assets'));
    }
    
    /**
     * Enqueue editor assets
     * 
     * @since 1.0.0
     */
    public function enqueue_editor_assets() {
        $asset_file = PBS_PLUGIN_DIR . 'build/index.asset.php';
        $asset = file_exists($asset_file) ? include $asset_file : array(
            'dependencies' => array('wp-blocks', 'wp-element', 'wp-editor'),
            'version' => PBS_VERSION
        );
        
        // Editor JavaScript
        wp_enqueue_script(
            'pbs-blocks-editor',
            PBS_PLUGIN_URL . 'build/index.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );
        
        // Editor Styles
        wp_enqueue_style(
            'pbs-blocks-editor',
            PBS_PLUGIN_URL . 'build/index.css',
            array('wp-edit-blocks'),
            $asset['version']
        );
        
        // Localize script for editor
        wp_localize_script('pbs-blocks-editor', 'pbsEditor', array(
            'pluginUrl' => PBS_PLUGIN_URL,
            'version' => PBS_VERSION,
            'nonce' => wp_create_nonce('pbs_editor_nonce'),
        ));
    }
    
    /**
     * Enqueue frontend assets
     * 
     * @since 1.0.0
     */
    public function enqueue_frontend_assets() {
        // Only enqueue if we have PBS blocks on the page
        if (!$this->has_pbs_blocks()) {
            return;
        }
        
        $asset_file = PBS_PLUGIN_DIR . 'build/frontend.asset.php';
        $asset = file_exists($asset_file) ? include $asset_file : array(
            'dependencies' => array('jquery'),
            'version' => PBS_VERSION
        );
        
        // Frontend JavaScript
        wp_enqueue_script(
            'pbs-blocks-frontend',
            PBS_PLUGIN_URL . 'build/frontend.js',
            $asset['dependencies'],
            $asset['version'],
            true
        );
        
        // Frontend Styles
        wp_enqueue_style(
            'pbs-blocks-frontend',
            PBS_PLUGIN_URL . 'assets/css/frontend.css',
            array(),
            PBS_VERSION
        );
        
        // Localize script for frontend
        wp_localize_script('pbs-blocks-frontend', 'pbsFrontend', array(
            'ajaxUrl' => admin_url('admin-ajax.php'),
            'nonce' => wp_create_nonce('pbs_frontend_nonce'),
            'version' => PBS_VERSION,
        ));
    }
    
    /**
     * Enqueue block assets (both editor and frontend)
     * 
     * @since 1.0.0
     */
    public function enqueue_block_assets() {
        // Block styles (shared between editor and frontend)
        wp_enqueue_style(
            'pbs-blocks-style',
            PBS_PLUGIN_URL . 'build/style-index.css',
            array(),
            PBS_VERSION
        );
    }
    
    /**
     * Check if current page has PBS blocks
     * 
     * @return bool
     * @since 1.0.0
     */
    private function has_pbs_blocks() {
        global $post;
        
        if (!$post || !has_blocks($post->post_content)) {
            return false;
        }
        
        $blocks = parse_blocks($post->post_content);
        return $this->search_for_pbs_blocks($blocks);
    }
    
    /**
     * Recursively search for PBS blocks
     * 
     * @param array $blocks Blocks array
     * @return bool
     * @since 1.0.0
     */
    private function search_for_pbs_blocks($blocks) {
        foreach ($blocks as $block) {
            // Check if this is a PBS block
            if (strpos($block['blockName'], 'pbs/') === 0) {
                return true;
            }
            
            // Check inner blocks recursively
            if (!empty($block['innerBlocks'])) {
                if ($this->search_for_pbs_blocks($block['innerBlocks'])) {
                    return true;
                }
            }
        }
        
        return false;
    }
    
    /**
     * Get asset version
     * 
     * @param string $file Asset file path
     * @return string
     * @since 1.0.0
     */
    private function get_asset_version($file) {
        if (file_exists($file)) {
            return filemtime($file);
        }
        return PBS_VERSION;
    }
    
    /**
     * Enqueue conditional assets for specific blocks
     * 
     * @param string $block_name Block name
     * @since 1.0.0
     */
    public function enqueue_block_specific_assets($block_name) {
        switch ($block_name) {
            case 'pbs/content-slider':
                wp_enqueue_script('jquery');
                break;
                
            case 'pbs/progress-bar':
                // Enqueue intersection observer polyfill for older browsers
                wp_enqueue_script(
                    'pbs-intersection-observer',
                    PBS_PLUGIN_URL . 'assets/js/intersection-observer.js',
                    array(),
                    PBS_VERSION,
                    true
                );
                break;
        }
    }
}

