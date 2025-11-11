/* AI Animated Background JavaScript */
/* خلفية ذكاء اصطناعي متحركة - سكريبت التهيئة */

(function() {
    'use strict';
    
    // Check if elements already exist to avoid duplicates
    if (document.querySelector('.ai-grid-overlay')) {
        return;
    }
    
    // Wait for DOM to be ready
    function initAIBackground() {
        // Create AI Grid Overlay
        const gridOverlay = document.createElement('div');
        gridOverlay.className = 'ai-grid-overlay';
        document.body.insertBefore(gridOverlay, document.body.firstChild);
        
        // Create AI Circuit Lines
        const circuitLines = document.createElement('div');
        circuitLines.className = 'ai-circuit-lines';
        const circuitPositions = [
            { top: '20%', width: '300px', delay: '0s' },
            { top: '40%', width: '400px', delay: '2s' },
            { top: '60%', width: '350px', delay: '4s' },
            { top: '80%', width: '450px', delay: '6s' }
        ];
        
        circuitPositions.forEach(pos => {
            const line = document.createElement('div');
            line.className = 'circuit-line';
            line.style.top = pos.top;
            line.style.width = pos.width;
            line.style.animationDelay = pos.delay;
            circuitLines.appendChild(line);
        });
        document.body.insertBefore(circuitLines, document.body.firstChild);
        
        // Create AI Document Flow
        const documentFlow = document.createElement('div');
        documentFlow.className = 'ai-document-flow';
        const particles = [
            { emoji: '📄', left: '10%', delay: '0s' },
            { emoji: '📊', left: '25%', delay: '3s' },
            { emoji: '📈', left: '40%', delay: '6s' },
            { emoji: '📋', left: '55%', delay: '9s' },
            { emoji: '📑', left: '70%', delay: '12s' },
            { emoji: '💼', left: '85%', delay: '15s' },
            { emoji: '🤖', left: '15%', delay: '18s' },
            { emoji: '⚡', left: '50%', delay: '21s' },
            { emoji: '🎯', left: '75%', delay: '24s' },
            { emoji: '✨', left: '30%', delay: '27s' }
        ];
        
        particles.forEach(particle => {
            const div = document.createElement('div');
            div.className = 'ai-doc-particle';
            div.textContent = particle.emoji;
            div.style.left = particle.left;
            div.style.animationDelay = particle.delay;
            documentFlow.appendChild(div);
        });
        document.body.insertBefore(documentFlow, document.body.firstChild);
        
        console.log('✨ AI Animated Background initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initAIBackground);
    } else {
        initAIBackground();
    }
})();
