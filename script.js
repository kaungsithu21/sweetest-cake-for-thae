let toppingCount = 0;
let candlesBlown = 0;
const totalCandles = 4;

// 🌟 မွေးနေ့ဆုတောင်းစာသား
const wishText = "May your life be as bright and colorful as this cake! Wishing you endless sweetness, love, and joy on your special day.\n\nThank you for bringing so much happiness and beautiful smiles into my life. May every single day ahead of you be filled with laughter and all your dreams come true.\n\nHappy Birthday... Thae! 🎂❤️";

// 📱 ဖုန်းပေါ်တွင် Touch စနစ်ဖြင့် Drag ဆွဲနိုင်ရန်
window.addEventListener('DOMContentLoaded', () => {
    initTouchDrag();
    setupCandleClickBackup(); // ဖုန်းအတွက် လက်နဲ့နှိပ်ပြီး ငြိမ်းလို့ရမည့် စနစ်ကိုပါ အရန်သင့်ပြင်ထားမည်
});

function startGlowCake() {
    document.getElementById('setup-area').classList.add('hidden');
    document.getElementById('main-game').classList.remove('hidden');
    
    // ဖုန်းများတွင် Audio စနစ်ကို အသက်သွင်းရန် User Interaction အရင်လိုအပ်သဖြင့် Button နှိပ်ချိန်မှ စတင်ခေါ်ယူမည်
    initBlowDetection(); 
}

function showDefaultAvatar(imgElement) {
    imgElement.classList.add('hidden');
    const frame = imgElement.parentElement;
    const defaultIcon = frame.querySelector('.default-avatar');
    if (defaultIcon) {
        defaultIcon.classList.remove('hidden');
    }
}

// 📱 ဖုန်းများအတွက် ပိုမိုအာရုံခံနိုင်စွမ်းမြင့်မားအောင် ပြင်ဆင်ထားသော Microphone Sound Analysis
function initBlowDetection() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.4; // လေမှုတ်လိုက်သည့်လှိုင်းကို ချက်ချင်းသိစေရန် တုံ့ပြန်မှုကို မြှင့်တင်ထားသည်
        analyser.fftSize = 512;
        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;
            for (let i = 0; i < array.length; i++) { values += array[i]; }
            const average = values / array.length;

            // 📱 ဖုန်းမိုက်ခရိုဖုန်းများအတွက် အာရုံခံနိုင်စွမ်းကို ၄၅ သို့ လျှော့ချပေးထားသဖြင့် လေပြင်းပြင်းမှုတ်ရုံဖြင့် အလုပ်လုပ်မည်
            if (average > 45) {
                const activeCandles = document.querySelectorAll('.candle .flame:not([style*="display: none"])');
                if (activeCandles.length > 0) {
                    const candleToBlow = activeCandles[0].parentElement;
                    extinguishCandle(candleToBlow);
                }
            }
        };
    }).catch(function(err) {
        console.log("Mic access status: " + err);
        // မိုက်ခရိုဖုန်း Block ခံထားရပါက အသုံးပြုသူကို အသိပေးရန်
        alert("မွေးနေ့ဖယောင်းတိုင် မှုတ်နိုင်ရန် ဖုန်း Browser ၏ Microphone Permission ကို Allow ပေးရန် လိုအပ်ပါတယ်ဗျာ။ (သို့မဟုတ်) ဖယောင်းတိုင်များကို လက်ဖြင့်နှိပ်၍လည်း ငြိမ်းနိုင်ပါတယ်ခင်ဗျာ။");
    });
}

// 📱 အကယ်၍ မိုက်ခရိုဖုန်း လုံးဝအဆင်မပြေပါက ဖယောင်းတိုင်ကို လက်နဲ့နှိပ်ပြီး ငြိမ်းသတ်နိုင်မည့် အရန်စနစ်
function setupCandleClickBackup() {
    document.addEventListener('click', function(e) {
        const candle = e.target.closest('.candle');
        if (candle) {
            extinguishCandle(candle);
        }
    });
    // ဖုန်း Touch အတွက်ပါ ထည့်သွင်းခြင်း
    document.addEventListener('touchstart', function(e) {
        const candle = e.target.closest('.candle');
        if (candle) {
            extinguishCandle(candle);
        }
    }, { passive: true });
}

function extinguishCandle(candleElement) {
    const flame = candleElement.querySelector('.flame');
    const smoke = candleElement.querySelector('.smoke');
    
    if (flame && flame.style.display !== 'none') {
        flame.style.display = 'none';
        smoke.style.display = 'block';
        candlesBlown++;

        if (candlesBlown === 1) {
            const music = document.getElementById('bg-music');
            if (music) {
                music.play().catch(e => console.log("Audio waiting for user gesture"));
            }
        }
        checkProgress();
    }
}

// 💻 PC အတွက် Drag and Drop
function dragStart(event) {
    event.dataTransfer.setData("text/plain", event.target.id);
    event.dataTransfer.setData("emoji", event.target.innerText);
}

function allowDrop(event) {
    event.preventDefault();
}

function dropTopping(event) {
    event.preventDefault();
    const id = event.dataTransfer.getData("text/plain");
    const emoji = event.dataTransfer.getData("emoji");
    const draggedElement = document.getElementById(id);

    if (draggedElement) {
        draggedElement.remove(); 
        toppingCount++;

        const rect = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        createDroppedTopping(emoji, x, y);
    }
}

// 📱 ဖုန်း (Touch Screen) အတွက် Drag စနစ်
function initTouchDrag() {
    const toppings = document.querySelectorAll('.topping-item');
    const cakeArea = document.getElementById('cake-area') || document.querySelector('.cake');

    if (!cakeArea) return;

    toppings.forEach(topping => {
        let activeElement = null;

        topping.addEventListener('touchstart', function(e) {
            e.preventDefault();
            const touch = e.touches[0];
            activeElement = document.createElement('div');
            activeElement.innerText = topping.innerText;
            activeElement.style.position = 'fixed';
            activeElement.style.left = touch.clientX - 15 + 'px';
            activeElement.style.top = touch.clientY - 15 + 'px';
            activeElement.style.zIndex = '1000';
            activeElement.style.fontSize = '28px';
            activeElement.style.pointerEvents = 'none';
            document.body.appendChild(activeElement);
        }, { passive: false });

        topping.addEventListener('touchmove', function(e) {
            if (!activeElement) return;
            e.preventDefault();
            const touch = e.touches[0];
            activeElement.style.left = touch.clientX - 15 + 'px';
            activeElement.style.top = touch.clientY - 15 + 'px';
        }, { passive: false });

        topping.addEventListener('touchend', function(e) {
            if (!activeElement) return;
            
            const touch = e.changedTouches[0];
            const rect = cakeArea.getBoundingClientRect();

            if (touch.clientX >= rect.left && touch.clientX <= rect.right &&
                touch.clientY >= rect.top && touch.clientY <= rect.bottom) {
                
                topping.remove();
                toppingCount++;

                const x = touch.clientX - rect.left;
                const y = touch.clientY - rect.top;
                createDroppedTopping(topping.innerText, x, y);
            }

            activeElement.remove();
            activeElement = null;
        });
    });
}

function createDroppedTopping(emoji, x, y) {
    const decorations = document.getElementById('decorations');
    if (!decorations) return;
    
    const newItem = document.createElement('div');
    newItem.className = 'dropped-topping';
    newItem.innerText = emoji;
    newItem.style.left = `${x}px`;
    newItem.style.top = `${y}px`;
    decorations.appendChild(newItem);
}

// Progress Verification
function checkProgress() {
    if (candlesBlown === totalCandles) {
        document.getElementById('main-game').classList.add('hidden');
        document.getElementById('wish-message').classList.remove('hidden');

        if (typeof confetti === 'function') {
            confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } });
        }

        initSmoothLetterTypewriter(wishText);
    }
}

// Typewriter စနစ်
function initSmoothLetterTypewriter(text) {
    const container = document.getElementById("typewriter-text");
    if (!container) return;

    container.innerHTML = ""; 

    let currentParagraph = document.createElement("p");
    currentParagraph.style.margin = "0 0 16px 0";
    currentParagraph.style.minHeight = "1.6em"; 
    container.appendChild(currentParagraph);

    let charIndex = 0;

    function typeNextLetter() {
        if (charIndex < text.length) {
            const char = text.charAt(charIndex);

            if (char === "\n") {
                if (text.charAt(charIndex + 1) === "\n") {
                    charIndex++; 
                }
                currentParagraph = document.createElement("p");
                currentParagraph.style.margin = "0 0 16px 0";
                currentParagraph.style.minHeight = "1.6em";
                container.appendChild(currentParagraph);
            } else {
                const letterSpan = document.createElement("span");
                letterSpan.style.opacity = "0";
                letterSpan.style.transition = "opacity 0.15s ease-in-out";
                letterSpan.innerHTML = char === " " ? "&nbsp;" : char;
                
                currentParagraph.appendChild(letterSpan);

                requestAnimationFrame(() => {
                    setTimeout(() => {
                        letterSpan.style.opacity = "1";
                    }, 10);
                });
            }

            charIndex++;
            setTimeout(typeNextLetter, 50); 
        }
    }

    typeNextLetter();
}
