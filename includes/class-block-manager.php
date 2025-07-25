<?php
/**
 * Block Manager Class
 * 
 * Handles registration and management of all blocks
 * 
 * @package ProfessionalBlocksSuite
 * @since 1.0.0
 */

// Prevent direct access
if (!defined('ABSPATH')) {
    exit;
}

/**
 * PBS Block Manager Class
 * 
 * @since 1.0.0
 */
class PBS_Block_Manager {
    
    /**
     * Instance of this class
     * 
     * @var PBS_Block_Manager
     * @since 1.0.0
     */
    private static $instance = null;
    
    /**
     * Available blocks
     * 
     * @var array
     * @since 1.0.0
     */
    private $blocks = array();
    
    /**
     * Get instance
     * 
     * @return PBS_Block_Manager
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
        $this->init_blocks();
        $this->init_hooks();
    }
    
    /**
     * Initialize hooks
     * 
     * @since 1.0.0
     */
    private function init_hooks() {
        add_action('init', array($this, 'register_blocks'));
    }
    
    /**
     * Initialize blocks array
     * 
     * @since 1.0.0
     */
    private function init_blocks() {
        $this->blocks = array(
            'hero-banner' => array(
                'name' => 'pbs/hero-banner',
                'title' => __('*Hero Banner', 'professional-blocks-suite'),
                'description' => __('Create stunning hero banner sections', 'professional-blocks-suite'),
                'icon' => 'format-image',
                'category' => 'custom-blocks',
            ),
            'testimonial' => array(
                'name' => 'pbs/testimonial',
                'title' => __('*Testimonial', 'professional-blocks-suite'),
                'description' => __('Display customer testimonials with ratings', 'professional-blocks-suite'),
                'icon' => 'format-quote',
                'category' => 'custom-blocks',
            ),
            'call-to-action' => array(
                'name' => 'pbs/call-to-action',
                'title' => __('*Call to Action', 'professional-blocks-suite'),
                'description' => __('Create compelling call-to-action sections', 'professional-blocks-suite'),
                'icon' => 'megaphone',
                'category' => 'custom-blocks',
            ),
            'content-slider' => array(
                'name' => 'pbs/content-slider',
                'title' => __('*Content Slider', 'professional-blocks-suite'),
                'description' => __('Create engaging content sliders with navigation', 'professional-blocks-suite'),
                'icon' => 'slides',
                'category' => 'custom-blocks',
            ),
            'feature-box' => array(
                'name' => 'pbs/feature-box',
                'title' => __('*Feature Box', 'professional-blocks-suite'),
                'description' => __('Highlight features with icons and descriptions', 'professional-blocks-suite'),
                'icon' => 'star-filled',
                'category' => 'custom-blocks',
            ),
        );
    }
    
    /**
     * Register all blocks
     * 
     * @since 1.0.0
     */
    public function register_blocks() {
        foreach ($this->blocks as $block_slug => $block_config) {
            $this->register_single_block($block_slug, $block_config);
        }
    }
    
    /**
     * Register a single block
     * 
     * @param string $block_slug Block slug
     * @param array $block_config Block configuration
     * @since 1.0.0
     */
    private function register_single_block($block_slug, $block_config) {
        $block_json_file = PBS_PLUGIN_DIR . 'blocks/' . $block_slug . '/block.json';
        
        if (file_exists($block_json_file)) {
            register_block_type($block_json_file);
        } else {
            // Fallback registration if block.json doesn't exist
            register_block_type($block_config['name'], array(
                'title' => $block_config['title'],
                'description' => $block_config['description'],
                'icon' => $block_config['icon'],
                'category' => $block_config['category'],
                'editor_script' => 'pbs-blocks-editor',
                'editor_style' => 'pbs-blocks-editor',
                'style' => 'pbs-blocks-style',
            ));
        }
    }
    
    /**
     * Get all registered blocks
     * 
     * @return array
     * @since 1.0.0
     */
    public function get_blocks() {
        return $this->blocks;
    }
    
    /**
     * Get a specific block configuration
     * 
     * @param string $block_slug Block slug
     * @return array|false
     * @since 1.0.0
     */
    public function get_block($block_slug) {
        return isset($this->blocks[$block_slug]) ? $this->blocks[$block_slug] : false;
    }
    
    /**
     * Check if a block is registered
     * 
     * @param string $block_slug Block slug
     * @return bool
     * @since 1.0.0
     */
    public function is_block_registered($block_slug) {
        return isset($this->blocks[$block_slug]);
    }
}
