export default function initBouncingText() {
    const container = document.getElementById('floating-world');
    const blocks = document.querySelectorAll('.acid-block');
    
    if(!container || blocks.length === 0) return;

    const floaters = [];

    blocks.forEach((block) => {
        // Random start position
        let x = Math.random() * (window.innerWidth - block.offsetWidth);
        let y = Math.random() * (window.innerHeight - block.offsetHeight);
        
        // Random speed
        let vx = (Math.random() - 0.5) * 4; 
        let vy = (Math.random() - 0.5) * 4;

        block.style.transform = `translate(${x}px, ${y}px)`;

        floaters.push({ el: block, x, y, vx, vy });
    });

    function animate() {
        const w = window.innerWidth;
        const h = window.innerHeight;

        floaters.forEach(obj => {
            obj.x += obj.vx;
            obj.y += obj.vy;

            const width = obj.el.offsetWidth;
            const height = obj.el.offsetHeight;

            // Bounce off Right/Left
            if (obj.x + width >= w || obj.x <= 0) obj.vx *= -1;
            
            // Bounce off Bottom/Top
            if (obj.y + height >= h || obj.y <= 0) obj.vy *= -1;

            obj.el.style.transform = `translate(${obj.x}px, ${obj.y}px)`;
        });

        requestAnimationFrame(animate);
    }
    animate();
}