window.addEventListener('load', () => {
    const intro = document.getElementById('intro-screen');
    const bookContainer = document.getElementById('book-container');
    
    // 1. Tiempo de espera para ver el GIF (3 segundos)
    setTimeout(() => {
        if (intro) {
            // Empieza a desvanecer la intro
            intro.classList.add('fade-out');
            
            // 2. A mitad del desvanecido de la intro, empezamos a mostrar el libro
            // Esto hace que se fundan uno con el otro (Cross-fade)
            setTimeout(() => {
                bookContainer.classList.add('show-book');
            }, 500); // Se activa a los 0.5s de haber empezado el desvanecido

            // 3. Limpieza final: quitamos la intro del código
            setTimeout(() => {
                intro.style.display = 'none';
            }, 2000); 
        }
    }, 3000); 
});



const pages = document.querySelectorAll('.page');
let currentPage = 0;

// Variables para detectar el movimiento
let startX = 0;
let endX = 0;

// Inicializar Z-Index (Igual que antes)
function updateZIndex() {
    pages.forEach((page, index) => {
        if (index < currentPage) {
            page.style.zIndex = index;
        } else {
            page.style.zIndex = pages.length - index;
        }
    });
}
updateZIndex();

// --- LÓGICA DE GESTOS ---

const container = document.getElementById('book-container');

// 1. Capturar donde empieza el toque/click
container.addEventListener('touchstart', e => startX = e.touches[0].clientX);
container.addEventListener('mousedown', e => startX = e.clientX);

// 2. Capturar donde termina
container.addEventListener('touchend', e => {
    endX = e.changedTouches[0].clientX;
    handleSwipe();
});

container.addEventListener('mouseup', e => {
    endX = e.clientX;
    handleSwipe();
});

// 3. Decidir si pasa página o regresa
function handleSwipe() {
    const threshold = 50; // Distancia mínima para que cuente como deslizamiento
    
    if (startX - endX > threshold) {
        // Deslizó a la IZQUIERDA -> Siguiente
        nextPage();
    } else if (endX - startX > threshold) {
        // Deslizó a la DERECHA -> Anterior
        prevPage();
    }
}

function nextPage() {
    if (currentPage < pages.length) {
        pages[currentPage].classList.add('flipped');
        currentPage++;
        // Esperamos un poquito (0.1s) antes de actualizar el Z-Index 
        // para que la página ya esté en movimiento y no parpadee
        setTimeout(updateZIndex, 100); 
    }
}

function prevPage() {
    if (currentPage > 0) {
        currentPage--;
        pages[currentPage].classList.remove('flipped');
        setTimeout(updateZIndex, 100);
    }
}

// También dejamos que funcione haciendo CLICK en las esquinas
pages.forEach((page, index) => {
    page.onclick = (e) => {
        const rect = page.getBoundingClientRect();
        const x = e.clientX - rect.left;
        
        if (x > rect.width / 2) {
            nextPage(); // Clic en la derecha
        } else {
            prevPage(); // Clic en la izquierda
        }
    };
});


let inactivityTimer;
let hintWasShown = false; // Este es nuestro interruptor

const hint = document.createElement('div');
hint.id = 'swipe-hint';
hint.innerHTML = '← DESLIZA PARA LEER →';
document.body.appendChild(hint);

function showHint() {
    // SOLO se muestra si no se ha mostrado antes
    if (!hintWasShown) {
        hint.style.opacity = '1';
        hint.classList.add('pulse');
        hintWasShown = true; // Marcamos que ya se usó
    }
}

function hideHint() {
    hint.style.opacity = '0';
    hint.classList.remove('pulse');
    // Al ocultarlo, limpiamos el temporizador para que no regrese
    clearTimeout(inactivityTimer);
}

function resetInactivityTimer() {
    if (!hintWasShown) {
        clearTimeout(inactivityTimer);
        inactivityTimer = setTimeout(showHint, 5000);
    }
}

// Escuchar interacción para matar el mensaje apenas ella toque el libro
container.addEventListener('touchstart', hideHint);
container.addEventListener('mousedown', hideHint);

// Iniciar el temporizador inicial (después de la intro)
setTimeout(resetInactivityTimer, 4500);


function nextPage() {
    if (currentPage < pages.length) {
        pages[currentPage].classList.add('flipped');
        currentPage++;
        setTimeout(updateZIndex, 100);

        // SI ES LA ÚLTIMA PÁGINA
        if (currentPage === pages.length) {
            setTimeout(finalTransition, 2000);
        }
    }
}

function finalTransition() {
    const bookContainer = document.getElementById('book-container');
    bookContainer.style.transition = "opacity 1s ease"; // Hazlo más rápido
    bookContainer.style.opacity = '0';
    
    setTimeout(() => {
        bookContainer.style.display = 'none';
        // Esperamos un "pestañeo" extra (300ms) para que la RAM se libere
        setTimeout(generateHeart, 300); 
    }, 3500); 
}


function generateHeart() {
    const heartCont = document.getElementById('heart-container');
    const finalMsg = document.getElementById('final-message');
    
    heartCont.innerHTML = '';
    heartCont.style.display = 'block';
    heartCont.style.opacity = '1';
    heartCont.style.visibility = 'visible';

    const photos = [
    'h.png',
    'nao3.png',
    'corazon.png'
    ];
    
    const totalPhotos = 22;
    const scaleFactor = 14;

    for (let i = 0; i < totalPhotos; i++) {
        const t = (i / totalPhotos) * 2 * Math.PI;
        const x = 16 * Math.pow(Math.sin(t), 3);
        const y = -(13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

        const img = document.createElement('img');
        img.src = photos[i % photos.length];
        img.className = 'heart-photo';
        
        // Usamos las coordenadas del corazón
        img.style.left = (300 + x * scaleFactor) + 'px';
        img.style.top = (250 + y * scaleFactor) + 'px';
        
        const randomRot = (i % 2 === 0 ? 5 : -5);
        heartCont.appendChild(img);

        /// Aumenta un poco el tiempo entre apariciones para que la memoria respire
        setTimeout(() => {
        img.style.opacity = "1";
        img.style.transform = `rotate(${randomRot}deg) scale(1) translateY(0)`;
            }, i * 300); // 300ms es el tiempo perfecto para fluidez total
        }

    // Calculamos el tiempo total: (22 fotos * 300ms) + 3 segundos de pausa
    const tiempoEspera = (totalPhotos * 300) + 3000; 

    setTimeout(() => {
        heartCont.style.transition = "opacity 2s ease-out";
        heartCont.style.opacity = "0";

        setTimeout(() => {
            heartCont.style.display = "none";
            if (finalMsg) {
                finalMsg.classList.add('show-final');
                createConfetti(); 
            }
        }, 2000);
    }, tiempoEspera);
}

// NUEVA FUNCIÓN PARA CREAR CONFETTI
function createConfetti() {
    const container = document.getElementById('confetti-container');
    const colors = ['#FFD700', '#FF69B4', '#00BFFF', '#ADFF2F', '#FF4500'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        
        // Estilo básico y directo
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-20px';
        confetti.style.zIndex = '1500';
        confetti.style.borderRadius = '2px';
        
        container.appendChild(confetti);

        // Animación sencilla manual
        let pos = -20;
        let speed = Math.random() * 3 + 2;
        let angle = Math.random() * 2;

        function fall() {
            pos += speed;
            confetti.style.top = pos + 'px';
            confetti.style.transform = `rotate(${pos}deg)`;
            
            if (pos < window.innerHeight) {
                requestAnimationFrame(fall);
            } else {
                confetti.remove(); // Limpieza al terminar
            }
        }
        
        // Retraso aleatorio para que no caigan todos juntos
        setTimeout(() => {
            requestAnimationFrame(fall);
        }, Math.random() * 2000);
    }
}


// Detectar si la página se está recargando
if (performance.navigation.type === performance.navigation.TYPE_RELOAD) {
    // Si el usuario le dio a "Recargar", lo mandamos al index
    window.location.href = "index.html"; 
}
