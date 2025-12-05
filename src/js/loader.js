const initLoader = () => {
    const percentEl = document.getElementById('loader-percent');
    const barcodeEl = document.getElementById('dynamic-barcode');
    const textEl = document.getElementById('loader-text');
    
    if (!percentEl) return;

    let current = 0.0;
    let target = 10.1;
    let speed = 0.01; // Starting speed

    // Helper: Generate random barcode string
    const generateBarcode = () => {
        const chars = ["|", "|", "*", "|", "|", "|", " "];
        let str = "";
        for(let i=0; i<20; i++) {
            str += chars[Math.floor(Math.random() * chars.length)];
        }
        return str;
    };

    const update = () => {
        // 1. Logic to approach 99% but never hit 100%
        // The closer it gets to 99, the smaller the increment
        const dist = target - current;
        
        // Add a random tiny amount based on distance
        let increment = (dist * 0.05) + (Math.random() * 0.1);
        
        // Occasional "Glitch" - drop progress back down slightly
        // This makes it feel like it failed and is retrying
        if (Math.random() > 0.95 && current > 80) {
            current -= Math.random() * 5.0; // Drop back by up to 5%
            textEl.childNodes[0].nodeValue = "RE-VERIFYING PACKETS... "; // Change text momentarily
        } else if (current > 50 && Math.random() > 0.98) {
             textEl.childNodes[0].nodeValue = "LOADING ASSETS... "; // Restore text
        }

        current += increment;

        if (current >= 99.99) current = 99.90;

        percentEl.innerText = `[${current.toFixed(1)}%]`;

        if (Math.random() > 0.5) {
            barcodeEl.innerText = generateBarcode();
        }

        // Loop
        requestAnimationFrame(update);
    };

    update();
};

export default initLoader;