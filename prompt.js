export async function evaluate(task) {

  // TEMP mock — replace later with real LLM call

  return {
    alignment_score: 0.6,
    redundancy_score: task.history?.includes(task.description) ? 0.9 : 0.2,
    marginal_value_score: 0.3,
    cost_efficiency_score: 0.4,
    execution_risk_score: 0.2,
    notes: ["Mock evaluation"]
  }
}
