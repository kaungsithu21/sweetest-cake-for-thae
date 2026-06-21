let toppingCount = 0;
let candlesBlown = 0;
const totalCandles = 4;

// 🌟 မွေးနေ့ဆုတောင်းစာသား (အပိုဒ်ခွဲများ စနစ်တကျ ပါဝင်ပါသည်)
const wishText = "May your life be as bright and colorful as this cake! Wishing you endless sweetness, love, and joy on your special day.\n\nThank you for bringing so much happiness and beautiful smiles into my life. May every single day ahead of you be filled with laughter and all your dreams come true.\n\nHappy Birthday... Thae! 🎂❤️";

function startGlowCake() {
    document.getElementById('setup-area').classList.add('hidden');
    document.getElementById('main-game').classList.remove('hidden');
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

// Microphone sound analysis
function initBlowDetection() {
    navigator.mediaDevices.getUserMedia({ audio: true, video: false })
    .then(function(stream) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);
        const javascriptNode = audioContext.createScriptProcessor(2048, 1, 1);

        analyser.smoothingTimeConstant = 0.75; 
        analyser.fftSize = 1024;
        microphone.connect(analyser);
        analyser.connect(javascriptNode);
        javascriptNode.connect(audioContext.destination);

        javascriptNode.onaudioprocess = function() {
            const array = new Uint8Array(analyser.frequencyBinCount);
            analyser.getByteFrequencyData(array);
            let values = 0;
            for (let i = 0; i < array.length; i++) { values += array[i]; }
            const average = values / array.length;

            if (average > 52) {
                const activeCandles = document.querySelectorAll('.candle .flame:not([style*="display: none"])');
                if (activeCandles.length > 0) {
                    const candleToBlow = activeCandles[0].parentElement;
                    extinguishCandle(candleToBlow);
                }
            }
        };
    }).catch(function(err) {
        alert("မွေးနေ့ဖယောင်းတိုင် မှုတ်နိုင်ရန်အတွက် Microphone Permission ကို Allow ပေးလိုက်ပါခင်ဗျာ။");
        console.log("Mic access status: " + err);
    });
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
                music.play().catch(e => console.log("Audio waiting for focus"));
            }
        }
        checkProgress();
    }
}

// Drag and Drop
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

        const decorations = document.getElementById('decorations');
        const newItem = document.createElement('div');
        newItem.className = 'dropped-topping';
        newItem.innerText = emoji;
        newItem.style.left = `${x}px`;
        newItem.style.top = `${y}px`;

        decorations.appendChild(newItem);
    }
}

// Progress Verification
function checkProgress() {
    if (candlesBlown === totalCandles) {
        document.getElementById('main-game').classList.add('hidden');
        document.getElementById('wish-message').classList.remove('hidden');

        if (typeof confetti === 'function') {
            confetti({ particleCount: 180, spread: 90, origin: { y: 0.6 } });
        }

        // 🌟 စာလုံးတစ်လုံးချင်းစီ စည်းချက်ကျကျ ပေါ်လာစေမည့် Typewriter စနစ်သစ်ကို စတင်ရန်
        initSmoothLetterTypewriter(wishText);
    }
}

// 🌟 စာလုံးမပြတ်ဘဲ တစ်လုံးချင်းစီ Typewriter စတိုင်အတိုင်း ဖော်ပြပေးမည့် စနစ်သစ် 🌟
function initSmoothLetterTypewriter(text) {
    const container = document.getElementById("typewriter-text");
    if (!container) return;

    container.innerHTML = ""; // မျက်နှာပြင်ဟောင်းကို ရှင်းလင်းမည်

    let currentParagraph = document.createElement("p");
    currentParagraph.style.margin = "0 0 16px 0";
    currentParagraph.style.minHeight = "1.6em"; 
    container.appendChild(currentParagraph);

    let charIndex = 0;

    function typeNextLetter() {
        if (charIndex < text.length) {
            const char = text.charAt(charIndex);

            // \n တွေ့ရင် စာကြောင်းအသစ် (Paragraph အသစ်) ခွဲထွက်မည်
            if (char === "\n") {
                // ဆက်တိုက် Newline များအတွက် တစ်ကြောင်းထက်ပိုဆင်းရန် စစ်ဆေးခြင်း
                if (text.charAt(charIndex + 1) === "\n") {
                    charIndex++; // နောက်ထပ် \n ကိုပါ ကျော်ဖြတ်မည်
                }
                currentParagraph = document.createElement("p");
                currentParagraph.style.margin = "0 0 16px 0";
                currentParagraph.style.minHeight = "1.6em";
                container.appendChild(currentParagraph);
            } else {
                // စာလုံးတစ်လုံးချင်းစီကို မမြင်ရသေးဘဲ Span ထဲ ကြိုထည့်ပြီးမှ Fade In လုပ်မည်
                const letterSpan = document.createElement("span");
                letterSpan.style.opacity = "0";
                letterSpan.style.transition = "opacity 0.15s ease-in-out";
                letterSpan.innerHTML = char === " " ? "&nbsp;" : char;
                
                currentParagraph.appendChild(letterSpan);

                // Browser Layout ဆွဲပြီးတာနဲ့ ချက်ချင်း ဖော်ပြပေးရန်
                requestAnimationFrame(() => {
                    setTimeout(() => {
                        letterSpan.style.opacity = "1";
                    }, 10);
                });
            }

            charIndex++;
            setTimeout(typeNextLetter, 45); // စာလုံးတစ်လုံးချင်း ပေါ်မည့်အရှိန် (၄၅ မီလီစက္ကန့်)
        }
    }

    typeNextLetter();
}
