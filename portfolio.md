---
layout: default
title: Portfolio
---

<section class="portfolio-header">
  <p class="portfolio-eyebrow">THINGS I BUILT</p>
  <h1 class="portfolio-title">PROJECTS<br><span>& WORK.</span></h1>
</section>

<section class="portfolio-list">
  {% for project in site.projects %}
  <a href="{{ project.url | relative_url }}" class="portfolio-row">
    <span class="portfolio-row-eyebrow">{{ project.eyebrow }}</span>
    <span class="portfolio-row-title">{{ project.title }}</span>
    <span class="portfolio-row-arrow">↗</span>
  </a>
  {% endfor %}
</section>