// Birthday wishes text string
const wishText = "May your life be as bright and colorful as this cake! Wishing you endless sweetness, love, and joy on your special day.\n\nThank you for bringing so much happiness and beautiful smiles into my life. May every single day ahead of you be filled with laughter and all your dreams come true.\n\nHappy Birthday... Thae! 🎂❤️ Love You So Much Babe ❤️";

function startGlowCake() {
    document.getElementById('setup-area').classList.add('hidden');
    document.getElementById('main-game').classList.remove('hidden');
}

function showDefaultAvatar(imgElement) {
    imgElement.classList.add('hidden');
    const frame = imgElement.parentElement;
    const defaultIcon = frame.querySelector('.default-avatar');
    if (defaultIcon) {
        defaultIcon.classList.remove('hidden');
    }
}

// 🔑 Input Box ထဲတွင် 'LOVE' စာသား ရိုက်ထည့်မှု ရှိ/မရှိ စစ်ဆေးသည့် စနစ်
function checkLoveCode(inputElement) {
    const value = inputElement.value.trim().toUpperCase();
    
    if (value === "LOVE") {
        inputElement.disabled = true;
        
        const candles = document.querySelectorAll('.candle');
        candles.forEach(candle => {
            const flame = candle.querySelector('.flame');
            const smoke = candle.querySelector('.smoke');
            if (flame) flame.style.display = 'none';
            if (smoke) smoke.style.display = 'block';
        });

        const music = document.getElementById('bg-music');
        if (music) {
            music.play().catch(e => console.log("Audio waiting for user gesture interaction."));
        }

        setTimeout(() => {
            endGameAndShowWishes();
        }, 1000); 
    }
}

function dragStart(event) {}
function allowDrop(event) {}
function dropTopping(event) {}

function endGameAndShowWishes() {
    document.getElementById('main-game').classList.add('hidden');
    document.getElementById('wish-message').classList.remove('hidden');

    if (typeof confetti === 'function') {
        confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } });
    }

    initSmoothLetterTypewriter(wishText);
}

// 🌟 စာသားများထွက်နေစဉ် အသည်းပုံလေးများ ဖန်တီးပေးမည့် စနစ်သစ်
function createFallingHeart() {
    const rainZone = document.getElementById("hearts-rain-zone");
    if (!rainZone) return;

    const heart = document.createElement("div");
    heart.className = "falling-heart";
    
    // အသည်းပုံနှင့် လက်ခုပ်ပုံစံ အချစ်သင်္ကေတများကို Random ထုတ်ခြင်း
    const heartTypes = ["❤️", "💖", "💝", "💕"];
    heart.innerText = heartTypes[Math.floor(Math.random() * heartTypes.length)];

    // ကြွေကျမည့် ဘယ်/ညာ နေရာနှင့် အရွယ်အစားကို Random ချိန်ညှိခြင်း
    heart.style.left = Math.random() * 100 + "%";
    heart.style.fontSize = Math.random() * 8 + 12 + "px"; 
    
    // ကြွေကျမည့် အရှိန်နှုန်း (၃ စက္ကန့်မှ ၅ စက္ကန့်အတွင်း)
    const duration = Math.random() * 2 + 3;
    heart.style.animationDuration = duration + "s";

    rainZone.appendChild(heart);

    // Animation ပြီးတာနဲ့ Element ကို ပြန်ဖျက်ခြင်း
    setTimeout(() => {
        heart.remove();
    }, duration * 1000);
}

// 🌟 Emoji မပျက်စေသော Typewriter + Heart Rain ပေါင်းစပ်စနစ်
function initSmoothLetterTypewriter(text) {
    const container = document.getElementById("typewriter-text");
    if (!container) return;

    container.innerHTML = ""; 

    let currentParagraph = document.createElement("p");
    currentParagraph.style.margin = "0 0 16px 0";
    currentParagraph.style.minHeight = "1.6em"; 
    container.appendChild(currentParagraph);

    const charArray = Array.from(text);
    let charIndex = 0;

    // စာလုံးရိုက်နေစဉ်အတွင်း 250ms တိုင်း အသည်းပုံလေးတွေ ပုံမှန်ကြွေကျစေရန် Timer ပတ်ခြင်း
    const heartRainTimer = setInterval(createFallingHeart, 250);

    function typeNextLetter() {
        if (charIndex < charArray.length) {
            const char = charArray[charIndex];

            if (char === "\n") {
                if (charArray[charIndex + 1] === "\n") {
                    charIndex++; 
                }
                currentParagraph = document.createElement("p");
                currentParagraph.style.margin = "0 0 16px 0";
                currentParagraph.style.minHeight = "1.6em";
                container.appendChild(currentParagraph);
            } else {
                const letterSpan = document.createElement("span");
                letterSpan.style.opacity = "0";
                letterSpan.style.transition = "opacity 0.12s ease-in-out";
                letterSpan.innerHTML = char === " " ? "&nbsp;" : char;
                
                currentParagraph.appendChild(letterSpan);

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        letterSpan.style.opacity = "1";
                    }, 10);
                });
            }

            charIndex++;
            setTimeout(typeNextLetter, 120); 
        } else {
            // စာသားအားလုံး ရိုက်လို့ပြီးသွားရင် အသည်းပုံကြွေတာကို ရပ်တန့်လိုက်ခြင်း
            clearInterval(heartRainTimer);
        }
    }

    typeNextLetter();
}
