/* Creative Interactive Background Effects */

(function() {
    'use strict';
    
    // Create interactive mouse trail effect
    function createMouseTrail() {
        const canvas = document.createElement('canvas');
        canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            pointer-events: none;
            z-index: 0;
        `;
        document.body.insertBefore(canvas, document.body.firstChild);
        
        const ctx = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        
        const particles = [];
        const particleCount = 50;
        
        class Particle {
            constructor(x, y) {
                this.x = x;
                this.y = y;
                this.size = Math.random() * 3 + 1;
                this.speedX = Math.random() * 3 - 1.5;
                this.speedY = Math.random() * 3 - 1.5;
                this.life = 100;
            }
            
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                this.life -= 2;
                if (this.size > 0.2) this.size -= 0.1;
            }
            
            draw() {
                ctx.fillStyle = `rgba(255, 255, 255, ${this.life / 100})`;
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
                ctx.fill();
            }
        }
        
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();
                
                if (particles[i].life <= 0) {
                    particles.splice(i, 1);
                    i--;
                }
            }
            
            requestAnimationFrame(animate);
        }
        
        document.addEventListener('mousemove', (e) => {
            if (particles.length < particleCount) {
                particles.push(new Particle(e.clientX, e.clientY));
            }
        });
        
        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        });
        
        animate();
    }
    
    // Add smooth scroll enhancement
    function enhanceScrolling() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                const href = this.getAttribute('href');
                if (href !== '#' && document.querySelector(href)) {
                    e.preventDefault();
                    document.querySelector(href).scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });
    }
    
    // Add parallax effect to elements
    function addParallaxEffect() {
        const parallaxElements = document.querySelectorAll('.header, .container');
        
        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            parallaxElements.forEach((el, index) => {
                const speed = (index + 1) * 0.1;
                el.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }
    
    // Initialize all effects
    function initBackground() {
        console.log('🎨 Creative background initialized');
        
        // Add mouse trail effect
        createMouseTrail();
        
        // Enhance scrolling
        enhanceScrolling();
        
        // Add parallax (subtle effect)
        // Commented out to prevent interference with card animations
        // addParallaxEffect();
        
        // Add entrance animations to elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.animation = 'fadeInUp 0.8s ease-out forwards';
                }
            });
        }, observerOptions);
        
        // Observe elements for entrance animations
        document.querySelectorAll('.card, .section-card, .action-card').forEach(el => {
            observer.observe(el);
        });
    }
    
    // Add CSS for entrance animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }
    `;
    document.head.appendChild(style);
    
    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBackground);
    } else {
        initBackground();
    }
})();
