# AGENTS.md

## Overview
Static "how this site was built with OpenCode" landing page (HTML, CSS, JS). No build, no backend, no paid services.

## Structure
- Index.html — markup
- style.css — styles
- script.js — timeline interactivity (opens on click)
- TZ.md — technical spec/roadmap
- README.md — brief summary

## Constraints
- Minimalism, dark theme, single accent color only. Don't add themes/animations unless specified.
- No external libraries, fonts, or CDNs without explicit approval.
- No paid APIs/services.
- Don't rename/remove existing files without confirmation.

## Workflow
- Work one task at a time.
- After changes, verify in browser (use Live Server on Index.html) and check console for errors.
- If layout breaks, revert and narrow scope.
- Commit after each completed task with a clear message.

## DoD
- Loads locally via Live Server, no console errors.
- Responsive on mobile.
- Timeline works as specified (click to expand/collapse).
- Matches constraints and passes manual check.