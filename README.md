# preflight

Minimal pre-execution policy layer for LLM tasks.

> Most systems optimize execution.
> This optimizes whether execution should happen at all.

---

## Overview

`preflight` is a lightweight decision layer that evaluates a task **before** it is executed by an LLM agent.

It helps prevent:

* redundant executions
* low-value iterations
* unnecessary token usage

This is not an agent framework.
This is a single, composable decision function.

---

## Why

Modern agent systems (ReAct, LangGraph, etc.) focus on:

> *How tasks should be executed*

But they assume:

> *Tasks should always run*

`preflight` introduces a missing layer:

> **Should this task run at all?**

---

## Example

```js
import { preflight } from "preflight"

const decision = await preflight(task)

if (decision.action === "SKIP") {
  console.log("Skipped:", decision.reasons)
  return
}

await agent.run(task)
```

---

## Example Output

```json
{
  "action": "SKIP",
  "confidence": 0.7,
  "reasons": ["Task already executed"]
}
```

---

## Decision Model

Preflight separates evaluation from execution:

* LLM provides structured scores
* deterministic policy computes action

This avoids:

* opaque reasoning
* non-reproducible decisions
* over-reliance on model judgment

---

## Evaluation Signals

Each task is scored across the following dimensions:

* **alignment_score** — relevance to the main goal
* **redundancy_score** — similarity to prior tasks
* **marginal_value_score** — expected improvement
* **cost_efficiency_score** — value relative to cost
* **execution_risk_score** — likelihood of failure or low-quality output

Scores are normalized (0 → 1).

---

## Policy

The system does **not** let the model decide directly.

Instead:

* model → scoring
* system → decision

Example actions:

* `RUN`
* `RUN_CHEAP`
* `SKIP`

---

## Design Principles

1. Heuristics first, LLM second
2. Evaluation cost must be lower than execution cost
3. Decisions are advisory, not enforced
4. Deterministic where possible
5. Composable with any agent system

---

## Relation to Agent Systems

Frameworks like ReAct, LangGraph, and Devin improve **how agents execute tasks**.

Preflight operates at a different layer:

* evaluates whether a task should execute at all
* independent of planning and reasoning loops
* provides consistent policy across agents

These systems are complementary.

---

## Example Scenario

### Without preflight

* tasks executed: 10
* cost: $6.20

### With preflight

* tasks executed: 6
* tasks skipped: 4
* cost: $3.70

**Savings: ~$2.50**

---

## Tradeoffs

* False negatives are possible (skipping useful tasks)
* Not effective for very low-cost tasks
* Requires task history for best results
* LLM scoring introduces some variability

---

## Not Included

* No orchestration
* No planning system
* No learning loop (yet)
* No guarantees of optimal decisions

This is a thin policy layer, not a framework.

---

## Minimal API

```ts
type Task = {
  description: string
  goal?: string
  estimated_cost?: number
  history?: string[]
}

type Decision = {
  action: "RUN" | "RUN_CHEAP" | "SKIP"
  confidence: number
  reasons: string[]
}
```

---

## Philosophy

> The model informs.
> The system decides.

---

## Status

Early prototype.
Intended as a composable primitive for agent systems.
