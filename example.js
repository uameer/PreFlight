import { preflight } from "./preflight.js"

const task = {
  description: "Refactor authentication logic",
  goal: "Ship MVP",
  history: ["Refactor authentication logic"],
  estimated_cost: 0.9
}

const decision = await preflight(task)

console.log(decision)
