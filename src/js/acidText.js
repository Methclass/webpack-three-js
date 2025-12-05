const acidText = () => {
    const container = document.getElementById('acid-container');
    const textEl = document.getElementById('acid-text');
    const body = document.body;

    // --- CONFIG ---
    const RED   = "#FF0000";
    const BLACK = "#000000";
    const WHITE = "#FFFFFF";
    const SCRAMBLE_SPEED = 40; 

    // --- SAFE GLITCH CHARACTERS ---
    const SAFE_SYMBOLS = "qrstuvwxyzMNO<>=?@%&0123456789";

    // --- HELPER FUNCTIONS ---
    const toPipes = (word) => {
        return word.split('').map(char => 
            `<span class="pipe-char">${char}</span>`
        ).join('<span class="pipe-separator">|</span>');
    };

    const scrambleText = (text, probability = 0.5) => {
        return text.split('').map(char => {
            if (char === ' ' || char === '|') return char;
            if (Math.random() < probability) {
                const randomSymbol = SAFE_SYMBOLS[Math.floor(Math.random() * SAFE_SYMBOLS.length)];
                return `<span class="wingdings-char">${randomSymbol}</span>`;
            }
            return char;
        }).join('');
    };

    // --- UPDATED SIZING LOGIC ---
    // Handles Words vs. Sentences
    const setSize = (text) => {
        // Reset defaults
        textEl.style.whiteSpace = "nowrap";
        textEl.style.maxWidth = "100%";
        textEl.style.lineHeight = "0.85";

        if (text.length < 7) {
            // Short words (READY, ERROR)
            textEl.style.fontSize = "15vw"; 
        } else if (text.length < 20) {
            // Medium words (METHCLASS)
            textEl.style.fontSize = "10vw"; 
        } else {
            // LONG SENTENCES (Wittgenstein)
            textEl.style.fontSize = "5vw";       // Smaller font
            textEl.style.whiteSpace = "normal";  // Allow wrapping
            textEl.style.maxWidth = "80vw";      // Keep it centered with margins
            textEl.style.lineHeight = "1.2";     // Readable spacing
        }
    };

    // --- THE SEQUENCE ---
    const sequence = [
        // 1. BOOT SEQUENCE
        { text: "NOT",    bg: BLACK, color: WHITE, style: "normal",   active: false, duration: 400 },
        { text: "READY",  bg: WHITE, color: BLACK, style: "normal",   active: true,  duration: 400 },
        { text: "YET",    bg: BLACK, color: RED,   style: "normal",   active: true,  duration: 400 },

        // 2. WITTGENSTEIN PROPOSITION 1
        { text: "The world is everything that is the case.", 
          bg: BLACK, color: WHITE, style: "normal", active: false, duration: 3000 },

        // 3. GLITCH INTERLUDE
        { text: "ERROR",  bg: RED,   color: BLACK, style: "normal",   active: true, duration: 100 },
        { text: "FATAL",  bg: BLACK, color: RED,   style: "highlight", active: true, duration: 100 },

        // 4. WITTGENSTEIN PROPOSITION 1.1
        { text: "The world is the totality of facts, not of things.", 
          bg: WHITE, color: BLACK, style: "normal", active: false, duration: 3500 },

        // 5. STROBE INTERLUDE
        { text: "NO",     bg: BLACK, color: WHITE, style: "boxed",    active: false, duration: 100 },
        { text: "YES",    bg: WHITE, color: BLACK, style: "boxed",    active: true,  duration: 100 },

        // 6. WITTGENSTEIN PROPOSITION 1.11
        { text: "The world is determined by the facts, and by these being all the facts.", 
          bg: BLACK, color: RED,   style: "normal", active: false, duration: 4000 },

        // 7. MATRIX RAIN GLITCH
        { text: "404",    bg: BLACK, color: WHITE, style: "highlight", active: true, duration: 150 },
        { text: "NULL",   bg: WHITE, color: RED,   style: "normal",    active: true, duration: 150 },

        // 8. WITTGENSTEIN PROPOSITION 1.12
        { text: "For the totality of facts determines both what is the case, and also all that is not the case.", 
          bg: BLACK, color: WHITE, style: "normal", active: false, duration: 4500 },

        // 9. LOGICAL SPACE
        { text: "The facts in logical space are the world.", 
          bg: RED,   color: BLACK, style: "highlight",  active: false, duration: 3000 },

        // 10. DIVIDES
        { text: "The world divides into facts.", 
          bg: WHITE, color: BLACK, style: "normal", active: true,  duration: 2000 }, // Active=true makes this glitch while reading!

        // 11. FINAL PROPOSITION
        { text: "Any one can either be the case or not be the case, and everything else remain the same.", 
          bg: BLACK, color: RED,   style: "normal", active: false, duration: 5000 },

        // 12. ENDING / LOOP
        { text: "METHCLASS", bg: BLACK, color: RED, style: "normal", active: false, duration: 4000 },
    ];

    let currentIndex = 0;
    let glitchInterval = null;

    const playFrame = () => {
        if (glitchInterval) {
            clearInterval(glitchInterval);
            glitchInterval = null;
        }

        const frame = sequence[currentIndex];

        // Apply Colors
        body.style.backgroundColor = frame.bg;
        textEl.style.color = frame.color;
        textEl.style.borderColor = frame.color;
        
        // Reset classes
        textEl.className = ''; 
        if (frame.style === 'boxed') textEl.classList.add('style-boxed');
        if (frame.style === 'highlight') textEl.classList.add('style-highlight');
        
        // Apply Sizing (Important for sentences!)
        setSize(frame.text);

        // Logic
        if (frame.active) {
            textEl.innerHTML = scrambleText(frame.text, 0.3); // Lower probability for readability
            glitchInterval = setInterval(() => {
                textEl.innerHTML = scrambleText(frame.text, 0.3);
            }, SCRAMBLE_SPEED);
        } else if (frame.style === 'pipes') {
            if(!frame.text.includes('|')) textEl.innerHTML = toPipes(frame.text);
            else textEl.innerHTML = frame.text.split('|').join('<span class="pipe-separator">|</span>');
        } else {
            textEl.innerText = frame.text;
        }

        currentIndex = (currentIndex + 1) % sequence.length;
        setTimeout(playFrame, frame.duration);
    };

    playFrame();
};

export default acidText;