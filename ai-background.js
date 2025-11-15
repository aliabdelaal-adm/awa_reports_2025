/* Animated Sky Background with Clouds, Birds, and Airplanes */
/* خلفية سماء متحركة مع غيوم وطيور وطائرات */

(function() {
    'use strict';
    
    // Check if elements already exist to avoid duplicates
    if (document.querySelector('.sky-elements-container')) {
        return;
    }
    
    // Wait for DOM to be ready
    function initSkyBackground() {
        // Create sky elements container
        const skyContainer = document.createElement('div');
        skyContainer.className = 'sky-elements-container';
        
        // Create clouds with different sizes and speeds
        const cloudConfigs = [
            { width: 100, height: 40, top: '10%', duration: 45 },
            { width: 120, height: 50, top: '20%', duration: 55 },
            { width: 80, height: 35, top: '15%', duration: 40 },
            { width: 140, height: 55, top: '25%', duration: 60 },
            { width: 90, height: 38, top: '30%', duration: 50 },
            { width: 110, height: 45, top: '8%', duration: 48 },
        ];
        
        cloudConfigs.forEach((config, index) => {
            const cloud = document.createElement('div');
            cloud.className = 'cloud';
            cloud.style.width = config.width + 'px';
            cloud.style.height = config.height + 'px';
            cloud.style.top = config.top;
            cloud.style.left = '-150px';
            cloud.style.animationDuration = config.duration + 's';
            cloud.style.animationDelay = (index * 8) + 's';
            
            // Add cloud puffs for realistic shape
            cloud.innerHTML = `
                <div style="width: ${config.width * 0.5}px; height: ${config.height * 0.8}px; 
                     top: -${config.height * 0.3}px; left: ${config.width * 0.2}px;"></div>
                <div style="width: ${config.width * 0.6}px; height: ${config.height * 0.9}px; 
                     top: -${config.height * 0.4}px; right: ${config.width * 0.2}px;"></div>
            `;
            
            skyContainer.appendChild(cloud);
        });
        
        // Create birds with different speeds and heights
        const birdConfigs = [
            { emoji: '🦅', top: '18%', duration: 35 },
            { emoji: '🕊️', top: '28%', duration: 40 },
            { emoji: '🦜', top: '22%', duration: 38 },
            { emoji: '🦆', top: '32%', duration: 42 },
            { emoji: '🐦', top: '25%', duration: 36 },
        ];
        
        birdConfigs.forEach((config, index) => {
            const bird = document.createElement('div');
            bird.className = 'bird';
            bird.textContent = config.emoji;
            bird.style.top = config.top;
            bird.style.left = '-50px';
            bird.style.animationDuration = config.duration + 's';
            bird.style.animationDelay = (index * 6) + 's';
            skyContainer.appendChild(bird);
        });
        
        // Create airplanes with different speeds
        const airplaneConfigs = [
            { emoji: '✈️', top: '12%', duration: 50 },
            { emoji: '🛩️', top: '35%', duration: 55 },
            { emoji: '✈️', top: '40%', duration: 48 },
        ];
        
        airplaneConfigs.forEach((config, index) => {
            const airplane = document.createElement('div');
            airplane.className = 'airplane';
            airplane.textContent = config.emoji;
            airplane.style.top = config.top;
            airplane.style.left = '-100px';
            airplane.style.animationDuration = config.duration + 's';
            airplane.style.animationDelay = (index * 15) + 's';
            skyContainer.appendChild(airplane);
        });
        
        // Insert sky container at the beginning of body
        document.body.insertBefore(skyContainer, document.body.firstChild);
        
        console.log('🌤️ Animated Sky Background initialized successfully');
    }
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initSkyBackground);
    } else {
        initSkyBackground();
    }
})();
