const canvas = document.getElementById('matrix');
const ctx = canvas.getContext('2d');
const numElement = document.getElementById('number');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
const fontSize = 16;
const columns = canvas.width / fontSize;
const drops = Array(Math.floor(columns)).fill(1);

function drawMatrix() {
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#ff007f"; 
    ctx.font = fontSize + "px monospace";

    drops.forEach((y, i) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillText(text, i * fontSize, y * fontSize);
        if (y * fontSize > canvas.height && Math.random() > 0.975) drops[i] = 0;
        drops[i]++;
    });
}
setInterval(drawMatrix, 33);

// --- SECUENCIA IDÉNTICA AL VIDEO (Centrada y Ordenada) ---
const secuencia = ["3", "2", "1", "HAPPY", "BIRTHDAY", "TO", "NAOMI", "❤️"];
let step = 0;

const timer = setInterval(() => {
    numElement.innerText = secuencia[step];
    
    // Animación de pulso centrada para cada palabra
    numElement.style.transform = "scale(1.2)";
    setTimeout(() => {
        numElement.style.transform = "scale(1)";
    }, 200);

    step++;
    if (step >= secuencia.length) {
        clearInterval(timer);
        setTimeout(() => {
            window.location.href = "libro.html";
        }, 3000);
    }
}, 1100); // Ritmo sincronizado con el video

function startCelebration() {
    document.getElementById('main-content').classList.remove('hidden');
    const container = document.getElementById('heart-album');
    
    // Usaremos 18 fotos para que la forma del corazón quede más definida
    const totalFotos = 18; 

    for (let i = 0; i < totalFotos; i++) {
        const div = document.createElement('div');
        div.className = 'photo';
        // Asegúrate de tener foto0.jpg, foto1.jpg... hasta foto17.jpg en la carpeta
        div.innerHTML = `<img src="foto${i}.jpg">`;
        
        container.appendChild(div);

        // Fórmula matemática del corazón para posicionar las fotos
        const t = (i / totalFotos) * 2 * Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));
        
        // --- ANIMACIÓN SUAVE Y ORDENADA DESDE EL CENTRO ---
        setTimeout(() => {
            // El multiplicador define el tamaño del corazón (se ajusta al alto de pantalla)
            const scale = Math.min(window.innerWidth, window.innerHeight) * 0.022; 
            const centerX = window.innerWidth / 2;
            const centerY = window.innerHeight / 2;
            
            // Calculamos la posición final con unidades relativas al centro
            const xFinal = centerX + (x * scale);
            const yFinal = centerY + (y * scale);
            
            // Aplicamos el movimiento y una rotación aleatoria para el estilo Polaroid
            div.style.left = `${xFinal}px`;
            div.style.top = `${yFinal}px`;
            div.style.transform = `translate(-50%, -50%) scale(1) rotate(${Math.random() * 20 - 10}deg)`;
        }, i * 180); // Cada foto vuela con un ligero retraso para orden
    }
}



// Función para arrancar la música al primer toque
function iniciarMusica() {
    const musica = document.getElementById('background-music');
    musica.play().catch(error => {
        console.log("El navegador bloqueó el inicio automático, esperando clic...");
    });
    // Guardamos que ya debe estar sonando para el siguiente HTML
    localStorage.setItem('musicaActivada', 'true');
}

// Escuchamos cualquier clic o toque en la pantalla de inicio
document.addEventListener('click', iniciarMusica, { once: true });
document.addEventListener('touchstart', iniciarMusica, { once: true });