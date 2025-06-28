// Elementos do DOM para o contador
const daysElement = document.querySelector("[data-days]");
const hoursElement = document.querySelector("[data-hours]");
const minutesElement = document.querySelector("[data-minutes]");
const secondsElement = document.querySelector("[data-seconds]");
const countdownElement = document.getElementById("countdown");

// Elementos para a mensagem final e o carrossel
const finalMessage = document.getElementById("final-message");
const photoCarousel = document.getElementById("photo-carousel");
const slides = document.querySelectorAll(".carousel-slide");

// Variáveis de controle do carrossel
let currentSlide = 0;
let slideInterval; // Variável para controlar o slideshow automático

/**
 * Atualiza o HTML do contador.
 * @param {number} days - Dias restantes.
 * @param {number} hours - Horas restantes.
 * @param {number} minutes - Minutos restantes.
 * @param {number} seconds - Segundos restantes.
 */
const renderCountdown = (days, hours, minutes, seconds) => {
  daysElement.innerHTML = String(days).padStart(2, "0");
  hoursElement.innerHTML = String(hours).padStart(2, "0");
  minutesElement.innerHTML = String(minutes).padStart(2, "0");
  secondsElement.innerHTML = String(seconds).padStart(2, "0");
};

// --- CONFIGURAÇÃO DA DATA ---
// Defina aqui o horário final — Mês começa em 0 (janeiro=0, junho=5)
// Formato: (Ano, Mês, Dia, Hora, Minuto, Segundo)
const targetDate = new Date(2025, 5, 28, 12, 0, 0);

/**
 * Simula um efeito de digitação em um elemento.
 * @param {string} msg - A mensagem a ser digitada.
 * @param {HTMLElement} el - O elemento onde a mensagem será exibida.
 * @param {number} [speed=150] - A velocidade de digitação em milissegundos.
 * @param {function} [callback] - Função a ser chamada quando a digitação terminar.
 */
const typeMessage = (msg, el, speed = 150, callback) => {
  let i = 0;
  el.innerHTML = "";
  el.style.display = "block"; // Garante que o elemento está visível

  const typer = () => {
    if (i < msg.length) {
      el.innerHTML += msg.charAt(i);
      i++;
      setTimeout(typer, speed);
    } else if (callback) {
      callback(); // Chama a função de callback no final
    }
  };
  typer();
};

/**
 * Inicia o slideshow automático e lida com o redirecionamento.
 */
const startSlideshow = () => {
  clearInterval(slideInterval); // Limpa o intervalo anterior para evitar acúmulo
  slideInterval = setInterval(() => {
    // Verifica se a foto atual é a última
    if (currentSlide >= slides.length - 1) {
      // Se for a última, para o slideshow
      clearInterval(slideInterval);
      // Espera 2 segundos e então redireciona para a carta
      setTimeout(() => {
        window.location.href = 'https://pardim06.github.io/princes2/';
      }, 3000); // 2000ms = 2 segundos
    } else {
      // Se não for a última, apenas avança para a próxima foto
      showSlide(currentSlide + 1);
    }
  }, 4000); // Muda de foto a cada 4 segundos
};

/**
 * Mostra ou esconde slides do carrossel.
 * @param {number} n - O índice do slide a ser mostrado.
 */
const showSlide = (n) => {
  // Esconde todos os slides
  slides.forEach((slide) => slide.classList.remove("active"));

  // Garante que o índice do slide seja cíclico (embora não seja mais necessário com a nova lógica)
  if (n >= slides.length) {
    currentSlide = slides.length - 1; 
  } else if (n < 0) {
    currentSlide = 0;
  } else {
    currentSlide = n;
  }

  // Mostra o slide correto
  if (slides[currentSlide]) {
    slides[currentSlide].classList.add("active");
  }
};

/**
 * Lida com o estado final, mostrando a mensagem e o carrossel.
 */
const showCelebration = () => {
  countdownElement.classList.add("hidden");

  // Efeito de digitação com callback para mostrar o carrossel
  typeMessage("Parabéns, Eu te amo ❤️", finalMessage, 150, () => {
    // A digitação terminou, agora mostra o carrossel
    setTimeout(() => {
      // Verifica se o elemento do carrossel existe antes de manipulá-lo
      if (photoCarousel) {
        photoCarousel.style.display = "block";
        showSlide(currentSlide);
        startSlideshow(); // Inicia o slideshow automático
      }
    }, 500); // Um pequeno atraso para dar um respiro
  });

  // Efeito de confete
  if (typeof confetti === "function") {
    confetti({
      particleCount: 200,
      spread: 90,
      origin: { y: 0.6 },
    });
  }
};

/**
 * A função principal do contador, que é chamada a cada segundo.
 */
const countdown = () => {
  const now = new Date();
  const timeLeft = targetDate.getTime() - now.getTime();

  // Se o tempo acabou, para o contador e mostra a celebração
  if (timeLeft <= 0) {
    renderCountdown(0, 0, 0, 0);
    showCelebration();
    clearInterval(interval);
    return;
  }

  // Calcula o tempo restante
  const days = Math.floor(timeLeft / (1000 * 60 * 60 * 24));
  const hours = Math.floor(
    (timeLeft % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);

  renderCountdown(days, hours, minutes, seconds);
};

// --- INICIALIZAÇÃO ---

// Inicia o contador imediatamente
countdown();
const interval = setInterval(countdown, 1000);
