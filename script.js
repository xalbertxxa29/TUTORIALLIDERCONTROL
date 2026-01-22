document.addEventListener('DOMContentLoaded', () => {
    console.log('Manual Lidercontrol loaded');

    // Add any specific interactive logic here
    const cards = document.querySelectorAll('.menu-card');

    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            // Subtle spotlight effect logic could go here if requested
            // For now, the CSS hover effects handle the main interactions
        });
    });

    // Service Worker only works on HTTP/HTTPS, not file://
    if ('serviceWorker' in navigator && (window.location.protocol === 'http:' || window.location.protocol === 'https:')) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('./sw.js')
                .then(registration => {
                    console.log('ServiceWorker registered:', registration);
                })
                .catch(error => {
                    console.log('ServiceWorker registration failed:', error);
                });
        });
    }

    // Fullscreen Logic
    window.toggleFullScreen = function (elemId) {
        const video = document.getElementById(elemId);
        if (!video) return;

        // Try native first (mostly for PC)
        // Note: In some WebViews, requestFullscreen exists but does nothing or fails.
        // We will prioritize the "Fake" fullscreen for better control in this specific user case
        // if the user is on mobile/tablet likely.

        const container = video.closest('.video-container');
        if (!container) return;

        // Check if we are already in fake fullscreen
        if (container.classList.contains('pseudo-fullscreen')) {
            container.classList.remove('pseudo-fullscreen');
            // Remove video specific styles if needed
            return;
        }

        // Apply Fake Fullscreen
        container.classList.add('pseudo-fullscreen');

        // Also try native just in case it works nicely behind the scenes
        if (video.requestFullscreen) {
            video.requestFullscreen().catch(e => console.log('Native FS failed, using fake'));
        } else if (video.webkitEnterFullScreen) {
            video.webkitEnterFullScreen(); // iOS
        }
    };
});
