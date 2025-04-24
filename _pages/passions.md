---
layout: page
title: Passions
permalink: /passions/
css: /assets/css/passions.css
order: 3
exclude: False
---

<main role="main">
    <h2>A glimpse into the sports that shaped my journey</h2>
    <div class="container">
        <div class="cards">
            {% for passion in site.data.passions %}
            <label class="card" data-index="{{ forloop.index0 }}">
                <img src="{{ passion.img }}" alt="{{ passion.title }}">
            </label>
            {% endfor %}
        </div>
        <div class="player">
            <div class="upper-part">
                <div class="info-area" id="info-area">
                    {% for passion in site.data.passions %}
                    <label class="info" id="info-{{ forloop.index }}">
                        <div class="info-title">{{ passion.title }}</div>
                        <p>{{ passion.description }}</p>
                    </label>
                    {% endfor %}
                </div>
            </div>
        </div>
    </div>
</main>

<script>
  // Get all passion items and initialize
  const cards = document.querySelectorAll('.card');
  const infos = document.querySelectorAll('.info');
  let currentSlide = 0;

  // Function to update slides
  function updateSlides() {
    cards.forEach((card, index) => {
      card.classList.remove('active-slide', 'hidden', 'left-neighbor', 'right-neighbor');
      infos[index].classList.remove('active');

      if (index === currentSlide) {
        card.classList.add('active-slide');
        infos[index].classList.add('active');
      } else if (index === (currentSlide - 1 + cards.length) % cards.length) {
        card.classList.add('left-neighbor');
      } else if (index === (currentSlide + 1) % cards.length) {
        card.classList.add('right-neighbor');
      } else {
        card.classList.add('hidden');
      }
    });
  }

  // Initialize slide
  updateSlides();

  // Navigate to next slide when card is clicked
  cards.forEach((card, index) => {
    card.addEventListener('click', () => {
      currentSlide = index;
      updateSlides();
    });
  });
</script>
