---
layout: page
title: Certificates
permalink: /certificates/
css: /assets/css/certificates.css
order: 2
exclude: False
---

<main role="main" class="certificates-container">
    <h2 class="page-title">Certificates</h2>
    
    <div class="certificates-grid">
      {% for cert in site.data.certificates %}
        <article class="cert-card">
          
          <header class="cert-header">
            <h3>{{ cert.title }}</h3>
            <span class="cert-date">{{ cert.date }}</span>
          </header>
          
          {% if cert.description and cert.description != "" %}
            <div class="cert-body">
              {{ cert.description | markdownify }}
            </div>
          {% endif %}
          
          <footer class="cert-footer">
            <div class="cert-issuer">
              <strong>Issuer:</strong> {{ cert.issuer | markdownify }}
            </div>
          </footer>
          
        </article>
      {% endfor %}
    </div>
</main>