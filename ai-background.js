/* UAE National Day Background JavaScript */
/* خلفية العيد الوطني لدولة الإمارات - سكريبت التهيئة */

(function() {
    'use strict';
    
    // Check if elements already exist to avoid duplicates
    if (document.querySelector('.uae-pattern-overlay')) {
        return;
    }
    
    // Wait for DOM to be ready
    function initUAEBackground() {
        // Create UAE Pattern Overlay
        const patternOverlay = document.createElement('div');
        patternOverlay.className = 'uae-pattern-overlay';
        document.body.insertBefore(patternOverlay, document.body.firstChild);
        
        // Create UAE Decorative Elements Container
        const decorativeElements = document.createElement('div');
        decorativeElements.className = 'uae-decorative-elements';
        
        // Create corner decorations
        const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        corners.forEach(corner => {
            const decoration = document.createElement('div');
            decoration.className = `uae-corner-decoration ${corner}`;
            decorativeElements.appendChild(decoration);
        });
        
        // Create subtle UAE-themed symbols (stars representing the seven emirates)
        const symbolPositions = [
            { text: '⭐', top: '15%', left: '20%' },
            { text: '⭐', top: '25%', left: '80%' },
            { text: '⭐', top: '45%', left: '10%' },
            { text: '⭐', top: '55%', left: '90%' },
            { text: '⭐', top: '75%', left: '25%' },
            { text: '⭐', top: '85%', left: '75%' },
            { text: '⭐', top: '35%', left: '50%' }
        ];
        
        symbolPositions.forEach(pos => {
            const symbol = document.createElement('div');
            symbol.className = 'uae-symbol';
            symbol.textContent = pos.text;
            symbol.style.top = pos.top;
            symbol.style.left = pos.left;
            decorativeElements.appendChild(symbol);
        });
        
        document.body.insertBefore(decorativeElements, document.body.firstChild);
        
        console.log('🇦🇪 UAE National Day Background initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initUAEBackground);
    } else {
        initUAEBackground();
    }
})();
