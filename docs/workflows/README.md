# Dynamic workflows — a small, scoped example

This folder is a worked example of Claude Code's **dynamic workflows** feature
(research preview). The goal is to show *how the feature works* on a task small
enough to run cheaply and reason about end-to-end.

## What a dynamic workflow is

Instead of one agent working through a task in a single loop, Claude writes an
**orchestration plan on the fly** and spins up a **fleet of coordinated subagents
in parallel**, then merges their results. It's the right tool for work that's too
big or too parallel for one loop — service-wide bug hunts, large migrations,
stress-testing a design. You trigger it just by using the word **"workflow"** in
a prompt.

These workflows are powerful and can burn tokens quickly, so the guidance is to
**start with a scoped task** — which is exactly what this example does.

## The example: a feature-area consistency audit

The scoped task: *audit this recipe app for error-handling and
auth/ownership/state consistency.* That naturally fans out, because the app's
feature areas are independent.

```
                    ┌─ Explore subagent ─ Auth area ──────────────┐
orchestrator ──────►├─ Explore subagent ─ Recipes area ───────────┤──► synthesize
(writes the plan)   └─ Explore subagent ─ Shared components area ──┘     one report
                         (read-only, run in parallel)
```

1. **Partition** the app into three non-overlapping areas (auth, recipes, shared
   components) so subagents don't step on each other.
2. **Fan out**: launch one read-only `Explore` subagent per area *in parallel*,
   each with its own file list and a strict output contract
   (`file:line — issue — one-line fix`).
3. **Synthesize**: merge the three reports, pull out cross-cutting themes, and
   rank the top fixes.

The output of running it is checked in at
[`example-audit-report.md`](./example-audit-report.md).

## Run it yourself

It's saved as a **reusable slash command** so the whole team can re-run it:

```
/recipe-audit
/recipe-audit error handling      # narrow the focus
```

See [`.claude/commands/recipe-audit.md`](../../.claude/commands/recipe-audit.md)
for the orchestration definition. Saving a workflow as a slash command (in the
project, or in your home dir to use everywhere) is how dynamic workflows become
reusable.

## Scaling up from here

This example uses just **3** parallel subagents on purpose. To go wider, add more
areas as additional parallel subagents (profile, dashboard, saved, middleware),
or swap the read-only audit for an action-taking workflow (e.g. apply the fixes
on a branch). For tasks where you'd rather let Claude decide *when* to escalate to
a workflow on its own, set `/effort ultracode`.
