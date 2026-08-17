import { generatePriority } from "./src/ai/generatePriority.js";

const result = generatePriority({
    severity: "HIGH",
    affectedPopulation: 500,
    reports: 20,
    locationRisk: 0.8,
    slaUrgency: 0.9
});

console.log(result);