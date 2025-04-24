---
layout: page
title: Publications
permalink: /publications/
css: /assets/css/publications.css
order: 1
exclude: True
---

<main role="main">
  <h2>Publications</h2>
  <div class="pub-list">
    {% for pub in site.data.publications %}
      <div class="pub-card">
        <div class="pub-meta">
          <h3 class="pub-title">{{ pub.title }}</h3>
          <p class="pub-authors">{{ pub.authors }}</p>
          <p class="pub-venue"><strong>{{ pub.venue }}</strong>, {{ pub.date }}</p>
          <a href="{{ pub.paper }}" class="pub-link" target="_blank">Read paper →</a>
        </div>
        <div class="pub-img">
          <a href="{{ pub.paper }}" target="_blank">
            <img src="{{ pub.img }}" alt="Paper thumbnail for {{ pub.title }}">
          </a>
        </div>
      </div>
    {% endfor %}
  </div>
</main>


