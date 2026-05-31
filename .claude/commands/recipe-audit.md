---
description: Run a dynamic-workflow consistency audit by fanning out parallel subagents across the app's feature areas
argument-hint: "[optional: focus, e.g. 'error handling' or 'auth']"
---

# Recipe Audit — a saved dynamic workflow

You are orchestrating a **dynamic workflow**: write an orchestration plan, then
spin up a fleet of coordinated, **read-only** subagents in parallel, one per
feature area, and finally synthesize their findings into a single report.

Keep this scoped — it is a fan-out *review*, not a refactor. Do not modify files.

## Orchestration

1. Partition the app into independent feature areas. Default partition:
   - **Auth** — `app/lib/auth/**`, `app/login`, `app/signup`, `app/reset-password`, `app/components/AuthButtons.tsx`
   - **Recipes** — `app/recipes/**` (create / view / edit / delete server actions + pages)
   - **Shared components** — `app/components/**` interactive pieces (comments, likes, lists)

   If the user passed an argument ($ARGUMENTS), narrow each subagent's audit to
   that focus.

2. Launch **one `Explore` (read-only) subagent per area, all in a single message
   so they run in parallel**. Give each:
   - its exact file list (so areas don't overlap),
   - the two audit axes: (a) error-handling consistency, (b) auth/ownership &
     state correctness,
   - an output contract: a short markdown section, each finding as
     `file:line — issue — one-line fix`, max ~6 findings, highest severity first.

3. When all subagents return, **synthesize**: merge into one report grouped by
   area, then add a "Cross-cutting themes" section for patterns that showed up in
   more than one area (e.g. inconsistent error-shape, missing user-facing error
   surfaces). Rank a short "Top fixes" list at the top.

4. Write the report to `docs/workflows/example-audit-report.md` and summarize the
   top findings back to the user. Do not apply fixes unless asked.

## Notes

- This is a deliberately **small, scoped** workflow (3 subagents). Dynamic
  workflows can fan out much wider, but they consume tokens fast — scope first.
- To extend: add more areas (e.g. `profile`, `dashboard`, `saved`) as additional
  parallel subagents in step 2.
