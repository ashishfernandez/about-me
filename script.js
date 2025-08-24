// Smooth scrolling and tile interactions
document.addEventListener('DOMContentLoaded', function() {
    const tiles = document.querySelectorAll('.tile');
    
    // Add click functionality to tiles
    tiles.forEach(tile => {
        tile.addEventListener('click', function() {
            const url = this.getAttribute('data-url');
            if (url) {
                // Open in new tab for external links
                if (url.startsWith('http')) {
                    window.open(url, '_blank');
                } else {
                    // Navigate to internal links
                    window.location.href = url;
                }
            }
        });
        
        // Add keyboard support
        tile.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                this.click();
            }
        });
        
        // Make tiles focusable
        tile.setAttribute('tabindex', '0');
        tile.setAttribute('role', 'button');
        tile.setAttribute('aria-label', `Navigate to ${this.querySelector('.tile-title').textContent}`);
    });
    
    // Intersection Observer for scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animationPlayState = 'running';
            }
        });
    }, observerOptions);
    
    tiles.forEach(tile => {
        observer.observe(tile);
    });
    
    // Smooth scrolling for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Handle window resize for responsive behavior
    let resizeTimeout;
    window.addEventListener('resize', function() {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(function() {
            // Force recalculation of layout on resize
            tiles.forEach(tile => {
                tile.style.transform = 'none';
                tile.offsetHeight; // Trigger reflow
                tile.style.transform = '';
            });
        }, 250);
    });
});

// Add loading state
window.addEventListener('load', function() {
    document.body.classList.add('loaded');
});

// Touch device optimization
if ('ontouchstart' in window) {
    document.body.classList.add('touch-device');
    
    // Optimize hover effects for touch devices
    const tiles = document.querySelectorAll('.tile');
    tiles.forEach(tile => {
        tile.addEventListener('touchstart', function() {
            this.classList.add('touch-active');
        });
        
        tile.addEventListener('touchend', function() {
            setTimeout(() => {
                this.classList.remove('touch-active');
            }, 300);
        });
    });
}