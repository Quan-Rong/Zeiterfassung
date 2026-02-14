/**
 * toast.js — Toast-Benachrichtigungsmodul
 * 
 * Zeigt kurze Benachrichtigungen am Bildschirm an.
 */

const Toast = (() => {
    let toastContainer = null;

    function init() {
        // Erstelle Toast-Container falls nicht vorhanden
        if (!toastContainer) {
            toastContainer = document.createElement('div');
            toastContainer.id = 'toastContainer';
            toastContainer.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                gap: 10px;
            `;
            document.body.appendChild(toastContainer);
        }
    }

    function show(message, type = 'info', duration = 3000) {
        init();

        const toast = document.createElement('div');
        toast.style.cssText = `
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
            font-size: 14px;
            font-weight: 500;
            min-width: 200px;
            max-width: 400px;
            animation: slideIn 0.3s ease-out;
        `;
        toast.textContent = message;

        // Animation CSS hinzufügen falls nicht vorhanden
        if (!document.getElementById('toastStyles')) {
            const style = document.createElement('style');
            style.id = 'toastStyles';
            style.textContent = `
                @keyframes slideIn {
                    from {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                    to {
                        transform: translateX(0);
                        opacity: 1;
                    }
                }
                @keyframes slideOut {
                    from {
                        transform: translateX(0);
                        opacity: 1;
                    }
                    to {
                        transform: translateX(100%);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }

        toastContainer.appendChild(toast);

        // Auto-remove nach duration
        setTimeout(() => {
            toast.style.animation = 'slideOut 0.3s ease-out';
            setTimeout(() => {
                if (toast.parentNode) {
                    toast.parentNode.removeChild(toast);
                }
            }, 300);
        }, duration);
    }

    return {
        init,
        success: (msg, duration) => show(msg, 'success', duration),
        error: (msg, duration) => show(msg, 'error', duration),
        info: (msg, duration) => show(msg, 'info', duration),
        warning: (msg, duration) => show(msg, 'warning', duration)
    };
})();

// Auto-init beim Laden
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => Toast.init());
} else {
    Toast.init();
}
