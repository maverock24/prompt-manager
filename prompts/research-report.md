---
title: Research Report — Infographic HTML Page
description: Research a topic via SearXNG and produce a self-contained HTML infographic report (5000+ words) with footnoted sources, a full source list, and a glossary. Plain, easy-to-understand writing.
---

# Research Report — Infographic HTML Page

Produce a deep research report on the given topic and deliver it as a **single, self-contained HTML page** in an infographic style. Every factual claim must be backed by a reputable source and cited with a footnote; all sources are listed at the end; and the report includes a glossary of the domain terms it uses. The writing must be easy to understand for a mixed technical/business audience.

## Input

Fill in the fields below, then start.

**Topic / research question:**

```
[WHAT TO RESEARCH — e.g. "state of EV charging infrastructure in the Nordics"]
```

**Focus / domain:**

```
[market research / tech engineering / other — e.g. "market research on a specific product category"]
```

**Audience:**

```
[mixed technical/business (default) — adjust if different]
```

**Length:**

```
[5000+ words (default)]
```

**Additional constraints (optional):**

```
[geographic scope, time range, angle, comparison targets, etc.]
```

---

## Phase 1 — Research with SearXNG

Do the research FIRST, before writing a word. Use **SearXNG only** for web access — do NOT use curl, wget, or any other web-fetching tool.

1. **Plan the queries.** Break the topic into sub-questions. Search each with SearXNG (`searxng_web_search`) using multiple distinct phrasings and synonyms, and paginate (`pageno`) to get past page 1. Use `time_range` when the topic is time-sensitive.
2. **Read, don't skim.** For every promising result, open the full page with the page reader (`web_url_read`). Never cite a snippet as evidence — read the actual content. Use `readHeadings: true` to scan structure before deep-reading.
3. **Source quality bar.** Prefer primary/official sources: official documentation, vendor docs, peer-reviewed studies, government and industry reports. Reputable secondary sources (established news and analyst outlets) are acceptable. Reject blogs, content farms, forums, and aggregators unless they are the only source and you explicitly flag them as weak.
4. **Minimum sources.** Gather at least **10 distinct reputable sources** for a 5000+ word report — more is better. Every factual claim must trace to at least one source.
5. **Verify and cross-check.** Confirm important numbers and claims in at least two independent sources where possible. Record the exact URL and title for every source. Note conflicting figures and state which you trust and why.
6. **Never guess or invent.** If you cannot find a source for a claim, either drop it or explicitly mark it as unverified. DO NOT fabricate URLs, statistics, or quotes.

## Phase 2 — Structure the Report

Produce an outline before writing. A 5000+ word report should include:

1. **Executive summary** — key takeaways up front (3–6 bullets).
2. **Background / context** — why this matters and the current state.
3. **Main findings** — 4–8 sections covering the sub-questions, each with data, numbers, and sources.
4. **Analysis / implications** — what it means for the reader (market implications, engineering implications, trends).
5. **Glossary** — auto-detected domain terms with plain-language definitions.
6. **Sources** — the complete numbered list of every source used.

## Phase 3 — Write in Plain, Easy Language

Write for a smart reader who is not an expert in this specific domain.

- Use short sentences and short paragraphs. One idea per paragraph.
- Define every domain term or acronym on first use, and add it to the glossary.
- Prefer concrete numbers and specific examples over vague claims.
- Use analogies for complex concepts.
- Avoid marketing fluff and filler. Every sentence earns its place.
- Lead each section with the conclusion, then support it.
- Mark every factual claim with a footnote marker (see Phase 4 for the exact mechanism).

## Phase 4 — Build the Self-Contained HTML Infographic

Deliver ONE HTML file with everything inline — no external CSS, JS, fonts, or CDN links. It must open correctly offline in any browser.

**Infographic style:** choose the visual style that best fits the topic (e.g., a bold poster with big stat callouts for market data, or a clean dashboard grid for engineering metrics). Use CSS to create visual interest — stat cards, big numbers, key-figure callouts, color-coded sections, bar/progress representations — without requiring JavaScript.

**Required elements:**
- Semantic, accessible HTML (`<header>`, `<main>`, `<section>`, `<footer>`). Alt text for any visuals.
- **Footnotes:** each factual claim gets a superscript marker (e.g., `<sup><a href="#src-1">1</a></sup>`) linking to its entry in the Sources section.
- **Sources section:** at the end, a numbered list (`id="src-N"`) with source title, publisher, and full URL as a clickable link. Add a back-link (↩) from each source to jump back to the claim.
- **Glossary:** a section listing every domain term used, with a short plain-language definition. Link terms in the body to their glossary entry where practical.
- Responsive layout (works on mobile and desktop) and print-friendly styles.

**Self-review checklist before returning the file:**
- Does every factual claim have a footnote? Are there zero unsourced assertions?
- Are all URLs real (ones you actually opened) and listed in Sources?
- Is the glossary complete — does it define every jargon term used?
- Is the writing genuinely easy to follow for a non-expert?
- Is the HTML a single self-contained file with no external dependencies?
- Is the report at least 5000 words and clearly structured?

---

## Before You Start, Ask Yourself:
- "Have I gathered enough reputable sources, or am I about to pad with weak ones?"
- "Is this claim backed by a source I actually read, or am I guessing?"
- "Would a busy non-expert understand this sentence, or is it hiding behind jargon?"
- "Does the visual style actually serve the content, or is it decoration?"
