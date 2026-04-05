---
layout: project
title: CH3SH1RE
eyebrow: AI · Python
status: active
description: "CH3SH1RE is a privacy-first AI assistant that runs entirely on my local hardware, built as a direct response to the data exposure that comes with cloud-based AI tools. Written in Python with SQLite for persistent memory, it routes queries to a locally-hosted language model meaning no API calls, no external logging, and no dependency on third-party servers. The project started from a single principle: that a personal AI assistant should be genuinely personal. Although I can't say much because my own hardware limits me."
date_range: Mar 2026 – present
type: Solo project
language: Python · 100%
github: https://github.com/LeCaseus/CH3SH1RE
tags: [Python, SQLite, llama.cpp, Qwen2.5, Local LLM, AI]
---

<div class="project-section">
  <div class="section-label">features & roadmap</div>
  <div class="features-grid">
    <div class="feature-card">
      <span class="feature-icon">🧠</span>
      <div class="feature-title">Local LLM Inference</div>
      <p class="feature-desc">Runs Qwen2.5 7B instruct (q5_k_m quantized) entirely on-device via a llama.cpp server. No internet required after setup.</p>
      <span class="feature-status status-done">✓ done</span>
    </div>
    <div class="feature-card">
      <span class="feature-icon">💾</span>
      <div class="feature-title">Persistent Memory</div>
      <p class="feature-desc">Conversations and context stored in a local SQLite database, letting the assistant remember past interactions.</p>
      <span class="feature-status status-done">✓ done</span>
    </div>
    <div class="feature-card">
      <span class="feature-icon">👁️</span>
      <div class="feature-title">Vision Capabilities</div>
      <p class="feature-desc">Image understanding through a dedicated vision service, allowing the assistant to process and describe visual input.</p>
      <span class="feature-status status-wip">⬤ in progress</span>
    </div>
    <div class="feature-card">
      <span class="feature-icon">🌐</span>
      <div class="feature-title">Web Search</div>
      <p class="feature-desc">Planned integration to give the assistant access to live web results to answer questions beyond its training data.</p>
      <span class="feature-status status-planned">○ planned</span>
    </div>
    <div class="feature-card">
      <span class="feature-icon">📚</span>
      <div class="feature-title">RAG</div>
      <p class="feature-desc">Planned support for loading personal documents so the assistant can answer questions grounded in your own data.</p>
      <span class="feature-status status-planned">○ planned</span>
    </div>
    <div class="feature-card">
      <span class="feature-icon">🛠️</span>
      <div class="feature-title">Tool Use</div>
      <p class="feature-desc">Exploring function calling and tool-use patterns to let the assistant take actions, not just answer questions.</p>
      <span class="feature-status status-planned">○ planned</span>
    </div>
  </div>
</div>

<div class="project-section">
  <div class="section-label">tech stack</div>
  <div class="stack-grid">
    <div class="stack-item"><span class="stack-icon">🐍</span><div><div class="stack-name">Python</div><div class="stack-role">Core language</div></div></div>
    <div class="stack-item"><span class="stack-icon">🦙</span><div><div class="stack-name">llama.cpp</div><div class="stack-role">LLM inference server</div></div></div>
    <div class="stack-item"><span class="stack-icon">🤖</span><div><div class="stack-name">Qwen2.5 7B</div><div class="stack-role">Language model</div></div></div>
    <div class="stack-item"><span class="stack-icon">🗄️</span><div><div class="stack-name">SQLite</div><div class="stack-role">Memory & storage</div></div></div>
  </div>
</div>

<div class="project-section">
  <div class="section-label">hardware specs (dev machine)</div>
  <div class="specs-box">
    <div class="spec-row"><span class="spec-key">CPU</span><span class="spec-val">AMD Ryzen 5 5500U @ 2.1 GHz</span></div>
    <div class="spec-row"><span class="spec-key">RAM</span><span class="spec-val">16 GB</span></div>
    <div class="spec-row"><span class="spec-key">GPU</span><span class="spec-val">NVIDIA RTX 3050 Laptop — 4 GB VRAM</span></div>
    <div class="spec-row"><span class="spec-key">Model</span><span class="spec-val"><code>qwen2.5-7b-instruct-q5_k_m.gguf</code></span></div>
    <div class="spec-row"><span class="spec-key">Inference</span><span class="spec-val">llama.cpp local server — fully offline</span></div>
  </div>
</div>