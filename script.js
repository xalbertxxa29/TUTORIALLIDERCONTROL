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

    if ('serviceWorker' in navigator) {
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
});
