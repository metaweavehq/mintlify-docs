# Skills Rewrite Plan — White-Paper Style

> **Purpose**: This is a working plan / prompt file. If a session loses memory, read this first to resume the task without losing context.

---

## Current state

- Skills tab currently has **44 individual MDX pages** at [skills/](../skills/) — one per skill (analyzer + collector listed separately)
- Each page is short, plain documentation: "What it does / When to use / How it works / Output / Related skills"
- 16 analyzer skills already have LaTeX `$$...$$` formulas
- docs.json Skills tab is a flat list, alphabetical, with `skills/overview.mdx` first

## Goal

Rewrite the Skills section so each **domain** is a single white-paper-style MDX that merges its analyzer + collector(s) into one document, includes code snapshots, formulas, diagrams, and reads like a technical paper rather than thin docs.

### What "white paper style" means here

- Long-form, sectioned narrative — not bullet-list reference
- Real LaTeX formulas (`$$...$$`) for every quantitative threshold or score
- **Code snapshots** showing key analysis logic (Python excerpts, ~10–30 lines, syntax-highlighted MDX code blocks)
- Architecture diagrams as ASCII or mermaid
- Worked examples ("on POSUN we observed X, the analyzer scored it Y, escalation Z")
- A **References** section pointing to the source-of-truth Python templates
- Headers / cards / callouts using Mintlify components (`<Note>`, `<Warning>`, `<Card>`, `<Steps>`, `<Tabs>`)

## Source material

### Existing (already read into context)

- Skill source: `/Users/prasanna/Documents/Workspace/OFFICAL/Shared/Demo/.claude/skills/use-skills/skills/{maritime,document,knowledge,core}/<skill>/`
  - Each has `SKILL.md`, `references/*.md`, often `scripts/*.py`
- Existing user-facing MDX: `/Users/prasanna/Documents/Workspace/OFFICAL/Metaweave/Documentation/mintlify-docs/skills/<skill>.mdx`

### NEW source the user is providing

- Templates folder: `/Users/prasanna/Documents/Workspace/Workspace/agents/autonomous/case_file_generator/templates/`
- 151 templates across 21 categories (see [INDEX.md](/Users/prasanna/Documents/Workspace/Workspace/agents/autonomous/case_file_generator/templates/INDEX.md))
- Each category folder has: `README.md`, `FILE_MAPPING.md`, and Python scripts that contain the actual analysis logic

### Mapping templates ↔ skill domains

| Template folder | Merged skill MDX |
|-----------------|------------------|
| `class_analysis` | `skills/class.mdx` (merge class-society-analyzer + class-society-data) |
| `performance-analysis` | `skills/engines.mdx` or split me/ae (merge me-performance-* + ae-performance-*) |
| `lube-oil-analysis` | `skills/lube-oil.mdx` (merge lube-oil-analyzer + lube-oil-data-collector) |
| `fuel-oil-analysis` | `skills/fuel-oil.mdx` |
| `bwt-management` | `skills/bwt.mdx` (note: also has BWTS microapp — link, don't duplicate) |
| `defect-management` | `skills/defects.mdx` |
| `pms-maintenance` | `skills/pms.mdx` |
| `purchase-management` | `skills/purchase.mdx` |
| `budget-management` | `skills/financial.mdx` |
| `forms-processing` + `forms-submission` | `skills/forms.mdx` |
| `email-processing` | `skills/outlook-email-sync.mdx` (rewrite, no analyzer pair) |
| `emission-monitoring` | `skills/emissions.mdx` (merge cii-emissions-microapp-data + new content) |
| `eta-voyage` | `skills/voyage.mdx` |
| `ihm-inventory` | `skills/ihm.mdx` (NEW skill — write from scratch) |
| `lsa-management` | `skills/lsa.mdx` (NEW skill — life-saving appliances) |
| `sire-cdi-monitoring` | merge into `skills/compliance.mdx` (compliance-analyzer + compliance-data-collector + sire/cdi material) |
| `general-analysis` | a `skills/_misc.mdx` or fold into overview |

## Plan / execution order

Do these one at a time. After each, commit with a descriptive message and let the user verify before moving to the next.

### Phase 1 — Domain merges (existing analyzer + collector pairs)

Order chosen by complexity / availability of template material:

1. **class** ← class-society-analyzer + class-society-data + `templates/class_analysis/*.py`
2. **engines (me + ae)** ← me-performance-* + ae-performance-* + `templates/performance-analysis/*.py`
3. **lube-oil** ← lube-oil-analyzer + lube-oil-data-collector + `templates/lube-oil-analysis/*.py`
4. **fuel-oil** ← fuel-oil-analyzer + fuel-oil-data-collector + `templates/fuel-oil-analysis/*.py`
5. **defects** ← defect-analyzer + defect-data-collector + `templates/defect-management/*.py`
6. **pms** ← pms-analyzer + pms-data-collector + `templates/pms-maintenance/*.py`
7. **purchase** ← purchase-analyzer + purchase-data-collector + `templates/purchase-management/*.py`
8. **financial** ← financial-analyzer + financial-data-collector + `templates/budget-management/*.py`
9. **forms** ← forms-analyzer + forms-data-collector + `templates/forms-processing/*.py` + `templates/forms-submission/*.py`
10. **voyage** ← voyage-analyzer + voyage-data-collector + `templates/eta-voyage/*.py`
11. **certificates** ← certificates-analyzer + certificates-data-collector
12. **crew** ← crew-analyzer + crew-data-collector
13. **water-treatment** ← water-treatment-analyzer + water-treatment-data-collector + `templates/bwt-management/*.py`
14. **compliance** ← compliance-analyzer + compliance-data-collector + `templates/sire-cdi-monitoring/*.py`
15. **emissions** ← cii-emissions-microapp-data + me-performance-microapp-data + `templates/emission-monitoring/*.py`

### Phase 2 — Solo skills (no collector pair)

16. **dashboard-creator** *(was deleted earlier — skip unless restored)*
17. **outlook-email-sync** ← rewrite with `templates/email-processing/*.py` material
18. **maritime-report-generator** — keep, expand
19. **qhse-investigation-report** — keep, expand
20. **image-analysis**, **image-generator** — keep, expand
21. **search-indexed-documents**, **pdf-to-markdown**, **pdf-vision-extractor** — keep, expand
22. **download-flag-circulars**, **download-makers-circulars** — keep, expand
23. **vessel-intelligence**, **validate-consumption-log-data** — keep, expand

### Phase 3 — New skills from templates (no existing MDX)

24. **ihm** ← `templates/ihm-inventory/`
25. **lsa** ← `templates/lsa-management/`
26. **general-analysis** ← `templates/general-analysis/` (might fold into overview)

### Phase 4 — Wrap-up

- Delete old per-skill MDX files that have been merged
- Update [docs.json](../docs.json) Skills tab to reference the new merged pages
- Update [skills/overview.mdx](../skills/overview.mdx) to reflect new structure
- Run `mint broken-links`

## Page template (use this skeleton for every merged white-paper)

```mdx
---
title: "<Domain Title>"
description: "<one-sentence positioning>"
---

## Executive summary

<3–5 sentence overview: what the domain covers, why it matters commercially / technically, what readers will learn from this page.>

## Architecture

```
<ASCII or mermaid diagram showing data sources → collector → analyzer → output → escalation>
```

## Stage 1 — Data collection

### Sources
<table of inputs in plain English>

### Acquisition flow
<steps — what the collector does>

### Code snapshot
<10–30 line Python excerpt from the actual collector or template, showing the key acquisition logic>

### Output
<plain-English description of the snapshot evidence>

## Stage 2 — Analysis

### Methodology
<sub-sections per dimension being analyzed: e.g. portfolio classification, threshold analysis, trend analysis>

### Key formulas
$$
<formula 1>
$$

$$
<formula 2>
$$

### Code snapshot
<10–30 line excerpt from analyzer / template showing the actual computation>

### Decision logic
<table of thresholds / classifications>

## Worked example

<Concrete vessel scenario — input numbers, the formula applied, the output verdict, the escalation decision>

## Escalation criteria

<table of triggers and severities>

## Output deliverables

<what the senior review contains>

## References

- Source skill: `<path>`
- Analysis template: `<path>`
- Related skills: `<links>`
```

## Conventions

- Always use `$$...$$` for block math, `$...$` for inline
- Code excerpts inside ` ```python `…` ``` ` fences
- ASCII diagrams inside fenced text blocks (no language hint, or use `text`)
- Use `<Note>`, `<Warning>`, `<Tip>` for callouts
- Use `<Steps>` for ordered procedures, `<Card>` for cross-links
- Cross-link to other merged skills via `[link](/skills/<slug>)`
- Keep mention of internal filenames out of the body — `data.json`, `case.yaml` etc. only inside collapsed `<details>` if essential

## Resume-from-cold-start prompt

If a future session needs to pick up this work:

> Continue the Skills white-paper rewrite. Read the plan at [.plan/skills-rewrite-plan.md](.plan/skills-rewrite-plan.md). Check which skills under [skills/](skills/) have already been merged into white-paper form (look for executive summary + code snapshots + worked example sections). Continue from the next item in the Phase 1 order. After each merge, delete the old per-skill MDX files that were absorbed and update [docs.json](docs.json) Skills tab. Use the page template in the plan. Each merged page should pull source material from both the original skill's `SKILL.md` (under `/Users/prasanna/Documents/Workspace/OFFICAL/Shared/Demo/.claude/skills/use-skills/skills/`) AND the matching template folder (under `/Users/prasanna/Documents/Workspace/Workspace/agents/autonomous/case_file_generator/templates/`).

## Status tracking

Update this list after each merge.

| # | Domain | Status | Merged from | Template source | Notes |
|---|--------|--------|-------------|-----------------|-------|
| 1 | class | ✅ done | class-society-analyzer + class-society-data | class_analysis/ | Merged into [class.mdx](../skills/class.mdx). Old per-skill files deleted. |
| 2 | engines | ✅ done | me/ae-performance-analyzer + 3 me/2 ae merged-from skills | performance-analysis/ (QA008, QA113) | Split into [me-performance.mdx](../skills/me-performance.mdx) and [ae-performance.mdx](../skills/ae-performance.mdx). 5 old files deleted. |
| 3 | lube-oil | ✅ done | lube-oil-analyzer + lube-oil-data-collector | lube-oil-analysis/ (QA103, QA104) + performance-analysis/ (QA002–QA004) | Merged into [lube-oil.mdx](../skills/lube-oil.mdx). Old files deleted. |
| 4 | fuel-oil | ✅ done | fuel-oil-analyzer + fuel-oil-data-collector | fuel-oil-analysis/ (QA083, QA086, QA209) | [fuel-oil.mdx](../skills/fuel-oil.mdx) — AccordionGroup-style threshold reference |
| 5 | defects | ✅ done | defect-analyzer + defect-data-collector | defect-management/ (19 templates) | [defects.mdx](../skills/defects.mdx) — 20-source rollup, ranking-driven |
| 6 | pms | ✅ done | pms-analyzer + pms-data-collector | pms-maintenance/ (11 templates) | [pms.mdx](../skills/pms.mdx) — major-machinery Tabs, debt-index |
| 7 | purchase | ✅ done | purchase-analyzer + purchase-data-collector | purchase-management/ (QA122, QA123, QA124) | [purchase.mdx](../skills/purchase.mdx) — funnel-driven |
| 8 | financial | ✅ done | financial-analyzer + financial-data-collector | budget-management/ (QA012-QA017) | [financial.mdx](../skills/financial.mdx) — pro-rata maths, AccordionGroup of 5 tables |
| 9 | forms | ✅ done | forms-analyzer + forms-data-collector | forms-processing + forms-submission (18 templates) | [forms.mdx](../skills/forms.mdx) — Q&amp;A framing, Tabs for views |
| 10 | voyage | ✅ done | voyage-analyzer + voyage-data-collector | eta-voyage/ (QA032, QA058) | [voyage.mdx](../skills/voyage.mdx) — CP-claim oriented |
| 11 | certificates | ✅ done | certificates-analyzer + certificates-data-collector | (no template) | [certificates.mdx](../skills/certificates.mdx) — flag-override deep-dive |
| 12 | crew | ✅ done | crew-analyzer + crew-data-collector | (no template) | [crew.mdx](../skills/crew.mdx) — four-constraints framing |
| 13 | water-treatment | ✅ done | water-treatment-analyzer + water-treatment-data-collector | bwt-management/ (QA010) | [water-treatment.mdx](../skills/water-treatment.mdx) — direction-aware trends |
| 14 | compliance | ✅ done | compliance-analyzer + compliance-data-collector | sire-cdi-monitoring/ (QA129, QA131, QA133, QA134) | [compliance.mdx](../skills/compliance.mdx) — five regimes, fleet view |
| 15 | emissions | ✅ done | cii-emissions-microapp-data | emission-monitoring/ (QA061, QA063, QA205) | [emissions.mdx](../skills/emissions.mdx) — five regulatory regimes |
| 16 | outlook-email-sync | ✅ done | (solo) | email-processing/ (20 topic trackers) | [outlook-email-sync.mdx](../skills/outlook-email-sync.mdx) — sync + topic-tracking |
| 17 | ihm | ✅ done | (new skill) | ihm-inventory/ (QA087-QA090) | [ihm.mdx](../skills/ihm.mdx) — HKC / EU SRR focus |
| 18 | lsa | ✅ done | (new skill) | lsa-management/ (QA106-QA108) | [lsa.mdx](../skills/lsa.mdx) — flag-overlay logic |

Mark ✅ when complete, ⏳ when in progress, ❌ when skipped (with reason).
