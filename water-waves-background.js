/* Water Waves Background Animation Script */

(function() {
    'use strict';
    
    // Create wave container elements
    function createWaveElements() {
        // Check if wave container already exists
        if (document.querySelector('.wave-container')) {
            return;
        }
        
        // Create wave container
        const waveContainer = document.createElement('div');
        waveContainer.className = 'wave-container';
        
        // Create three wave layers
        for (let i = 1; i <= 3; i++) {
            const wave = document.createElement('div');
            wave.className = `wave wave-${i}`;
            waveContainer.appendChild(wave);
        }
        
        // Insert at the beginning of body
        document.body.insertBefore(waveContainer, document.body.firstChild);
        
        console.log('Water waves background created');
    }
    
    // Create floating particles for water effect
    function createWaterParticles() {
        // Check if particles container already exists
        if (document.querySelector('.water-particles')) {
            return;
        }
        
        const particlesContainer = document.createElement('div');
        particlesContainer.className = 'water-particles';
        
        // Create 15 particles
        for (let i = 0; i < 15; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 3px and 8px
            const size = Math.random() * 5 + 3;
            particle.style.width = size + 'px';
            particle.style.height = size + 'px';
            
            // Random horizontal position
            particle.style.left = Math.random() * 100 + '%';
            
            // Random animation delay
            particle.style.animationDelay = Math.random() * 20 + 's';
            
            // Random animation duration
            particle.style.animationDuration = (Math.random() * 10 + 15) + 's';
            
            particlesContainer.appendChild(particle);
        }
        
        // Insert at the beginning of body
        document.body.insertBefore(particlesContainer, document.body.firstChild);
        
        console.log('Water particles created');
    }
    
    // Initialize the water waves background
    function initWaterWavesBackground() {
        createWaveElements();
        createWaterParticles();
        console.log('Water waves background initialized');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initWaterWavesBackground);
    } else {
        initWaterWavesBackground();
    }
})();
