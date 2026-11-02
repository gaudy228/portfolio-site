# AGENTS.md

## Overview
Static "how this site was built with OpenCode" landing page. Vanilla HTML, CSS and JavaScript only. No build step, no backend, no paid services.

## Structure
- Index.html — markup (header, hero, timeline, stack, tools, game, ai-story, tool, footer)
- style.css — design system, layout, animations, game, story and tool styles
- script.js — timeline interactivity and scroll-reveal animations
- game.js — tic-tac-toe vs bot logic (minimax)
- tool.js — TZ builder: live preview, clipboard copy and TZ.md download
- TZ.md — technical spec/roadmap
- README.md — brief summary

## Constraints
- Only HTML, CSS and vanilla JS. No external libraries, fonts, CDNs or paid APIs/services without explicit approval.
- Dark theme stays, but design is expressive: gradients, soft shadows, glow on accent elements, smooth hover effects.
- Single primary accent family (accent + secondary accent + glow). Do not introduce unrelated color themes.
- Animations must respect `prefers-reduced-motion` and stay smooth (transform/opacity, no expensive layout thrashing).
- Mobile layout is mandatory and must be checked at 375px and 360px widths.
- Existing sections (header, hero, timeline, stack, tools, footer) must keep working. Do not remove or rename files without confirmation.
- Don't add secrets, tracking or external requests.

## Workflow
- Work one task at a time. Each task = one step from the spec.
- After each step: stop, explain what changed, and wait for the user's "дальше" before continuing.
- After changes, verify in browser (Live Server on Index.html) and check the console for errors.
- If layout or behavior breaks, revert and narrow the scope.
- Commit only after the user confirms the step, with a clear message.

## Sections
- `#how` — existing "Как это сделано" timeline.
- `#game` — tic-tac-toe vs bot (player X, bot O, minimax hard by default, score series).
- `#ai-story` — short story about how the AI agent built the game (prompt, process, failures, result, takeaway).
- `#tool` — TZ builder with live formula preview, clipboard copy and TZ.md download.

## DoD
- Loads locally via Live Server, no console errors.
- Responsive on mobile (375px and 360px).
- `prefers-reduced-motion` disables non-essential animation.
- Timeline works as specified (click to expand/collapse).
- Game: hard bot is unbeatable, moves are blocked while bot "thinks", scores persist until reset.
- Tool: live preview, copy and TZ.md download work without external APIs.
- Lighthouse Performance stays at or above 85.
- Matches constraints and passes manual check.
