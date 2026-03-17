import { evaluate } from "./prompt.js"

export async function preflight(task) {

  // Heuristic: skip exact repetition
  if (task.history?.includes(task.description)) {
    return {
      action: "SKIP",
      confidence: 0.9,
      reasons: ["Task already executed"]
    }
  }

  const scores = await evaluate(task)

  const decision = decide(scores)

  return {
    action: decision,
    confidence: 0.7,
    reasons: scores.notes
  }
}

function decide(s) {
  const value =
    (s.alignment_score * 0.3) +
    (s.marginal_value_score * 0.3) +
    (s.cost_efficiency_score * 0.2) -
    (s.redundancy_score * 0.1) -
    (s.execution_risk_score * 0.1)

  if (s.redundancy_score > 0.8 && s.marginal_value_score < 0.3) {
    return "SKIP"
  }

  if (value > 0.6) return "RUN"
  if (value > 0.4) return "RUN_CHEAP"

  return "SKIP"
}
