document.addEventListener("DOMContentLoaded", () => {
    const container = document.getElementById('floating-world');
    const blocks = document.querySelectorAll('.acid-block');
    
    // Store physics data for each block
    const floaters = [];

    blocks.forEach((block) => {
        // Random starting position
        let x = Math.random() * (window.innerWidth - block.offsetWidth);
        let y = Math.random() * (window.innerHeight - block.offsetHeight);
        
        // Random velocity (speed and direction)
        // Values between -1.5 and 1.5
        let vx = (Math.random() - 0.5) * 3; 
        let vy = (Math.random() - 0.5) * 3;

        // Ensure they aren't not moving
        if(vx === 0) vx = 1;
        if(vy === 0) vy = 1;

        // Set initial position
        block.style.transform = `translate(${x}px, ${y}px)`;

        floaters.push({
            element: block,
            x: x,
            y: y,
            vx: vx,
            vy: vy,
            width: block.offsetWidth,
            height: block.offsetHeight
        });
    });

    function animate() {
        const screenW = window.innerWidth;
        const screenH = window.innerHeight;

        floaters.forEach(obj => {
            // Update positions
            obj.x += obj.vx;
            obj.y += obj.vy;

            // Collision Detection: Right Wall
            if (obj.x + obj.width >= screenW) {
                obj.vx = -1 * Math.abs(obj.vx); // Force move left
                obj.x = screenW - obj.width;
            }
            // Collision Detection: Left Wall
            else if (obj.x <= 0) {
                obj.vx = Math.abs(obj.vx); // Force move right
                obj.x = 0;
            }

            // Collision Detection: Bottom Wall
            if (obj.y + obj.height >= screenH) {
                obj.vy = -1 * Math.abs(obj.vy); // Force move up
                obj.y = screenH - obj.height;
            }
            // Collision Detection: Top Wall
            else if (obj.y <= 0) {
                obj.vy = Math.abs(obj.vy); // Force move down
                obj.y = 0;
            }

            // Apply movement
            obj.element.style.transform = `translate(${obj.x}px, ${obj.y}px)`;
        });

        requestAnimationFrame(animate);
    }

    // Start the loop
    animate();

    // Handle Window Resize (Update limits)
    window.addEventListener('resize', () => {
        floaters.forEach(obj => {
            // Recalculate width/height in case CSS changed them
            obj.width = obj.element.offsetWidth;
            obj.height = obj.element.offsetHeight;
        });
    });
});