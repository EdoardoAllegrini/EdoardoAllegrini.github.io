const slidesData = [
  { title: 'Basketball', imgSrc: '../images/basket.jpg', description: 'Passionate about basketball since the age of 13, I jumped into the game with my team and competed in local tournaments around Rome. Whether it\'s playing on the court or watching the NBA, the love for the game never stops.' },
  { title: 'Tennis', imgSrc: '../images/tennis.jpg', description: 'Driven by curiosity, I took up tennis after four years of basketball. My dedication and talent on the court led to an opportunity to train during the summer period at the prestigious <a href="https://emiliosanchezacademy.com/" target="_blank" rel="noopener noreferrer" id="link">Emilio Sánchez Academy</a>, a renowned professional tennis academy in Barcelona. <br> I am still an active competitive athlete, consistently training at a high level and passionately pursuing my goals in the game.' },
  { title: 'Chess', imgSrc: '../images/chess.jpg', description: 'I\'ve enjoyed playing chess with my parents since childhood, but in 2020, I began studying the game seriously. From that moment I\'ve played countless matches daily on <a href="https://chess.com/" target="_blank" rel="noopener noreferrer" id="link">Chess.com</a> continuously <b>fine-tuning (iykyk)</b> my skills.' },
  { title: 'Football', imgSrc: '../images/football.jpg', description: 'My passion for football has grown immensely over the years, ignited by my fascination with the Super Bowl. As a dedicated fan and supporter of the Kansas City Chiefs, I am constantly enveloped in the excitement and energy that the game brings. <br> Though it may seem unusual for someone of Italian origin to be so deeply immersed in American football, my journey reflects a broader curiosity and a desire to explore and learn about new and stimulating experiences. This enthusiasm for discovering different sides of life enriches both my personal and professional pursuits, driving me to continuously seek out new opportunities and challenges.' },
];

// Generate slides and info content dynamically
const cardsContainer = document.querySelector('.cards');
const infoArea = document.getElementById('info-area');

slidesData.forEach((slide, index) => {
  // Create slide element
  const slideElement = document.createElement('label');
  slideElement.classList.add('card');
  slideElement.innerHTML = `<img src="${slide.imgSrc}">`;
  slideElement.setAttribute('data-index', index);
  cardsContainer.appendChild(slideElement);

  // Create info element
  const infoElement = document.createElement('label');
  infoElement.classList.add('info');
  infoElement.id = `info-${index + 1}`;
  infoElement.innerHTML = `<div class="title">${slide.title}</div><p>${slide.description}</p>`;
  infoArea.appendChild(infoElement);
});

// Handle the sliding logic
let currentSlide = 0;

function updateSlides() {
  const slides = document.querySelectorAll('.card');
  const infos = document.querySelectorAll('.info');

  slides.forEach((slide, index) => {
    slide.classList.remove('active-slide', 'hidden', 'left-neighbor', 'right-neighbor');
    infos[index].classList.remove('active');

    if (index === currentSlide) {
      slide.classList.add('active-slide');
      infos[index].classList.add('active');
    } else if (index === (currentSlide - 1 + slides.length) % slides.length) {
      slide.classList.add('left-neighbor');
    } else if (index === (currentSlide + 1) % slides.length) {
      slide.classList.add('right-neighbor');
    } else {
      slide.classList.add('hidden');
    }
  });
}

updateSlides();

// Navigate to next slide
document.querySelectorAll('.card').forEach((slide, index) => {
  slide.addEventListener('click', () => {
    currentSlide = index;
    updateSlides();
  });
});
