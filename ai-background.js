/* Simple Background - All custom animations removed */

(function() {
    'use strict';
    
    // Simple initialization
    function initBackground() {
        console.log('Background initialized - simple mode');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackground);
    } else {
        initBackground();
    }
})();
