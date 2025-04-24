---
layout: page
title: Certificates
permalink: /certificates/
css: /assets/css/certificates.css
order: 2
exclude: False
---

<main role="main">
    <h2>Certificates</h2>
    <div class="certificates">
      {% for cert in site.data.certificates %}
        <div class="cert-card">
          <h3>{{ cert.title }}</h3>
          {% if cert.description %}
            <p>{{ cert.description | markdownify }}</p>
          {% endif %}
          <hr>
          <p><strong>Issuer:</strong> {{ cert.issuer | markdownify }}</p>
          <hr>
          <p><strong>Date:</strong> {{ cert.date }}</p>
        </div>
      {% endfor %}
    </div>
</main>


