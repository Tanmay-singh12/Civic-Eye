const SEVERITY_SCORE = {
    LOW: 1,
    MEDIUM: 2,
    HIGH: 3
};

function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function validateInput({
    severity,
    affectedPopulation,
    reports,
    locationRisk,
    slaUrgency
}) {
    if (!SEVERITY_SCORE[severity]) {
        throw new Error(`Invalid severity: ${severity}`);
    }

    const values = {
        affectedPopulation,
        reports,
        locationRisk,
        slaUrgency
    };

    for (const [key, value] of Object.entries(values)) {
        if (typeof value !== "number" || !Number.isFinite(value)) {
            throw new Error(`${key} must be a valid number.`);
        }
    }

    if (affectedPopulation < 0) {
        throw new Error("affectedPopulation cannot be negative.");
    }

    if (reports < 0) {
        throw new Error("reports cannot be negative.");
    }

    if (locationRisk < 0 || locationRisk > 1) {
        throw new Error("locationRisk must be between 0 and 1.");
    }

    if (slaUrgency < 0 || slaUrgency > 1) {
        throw new Error("slaUrgency must be between 0 and 1.");
    }
}

function normalizePopulation(population) {
    // 0–1000+ affected people → 0–1
    return clamp(population / 1000);
}

function normalizeReports(reports) {
    // 0–100+ reports → 0–1
    return clamp(reports / 100);
}

export function generatePriority({
    severity,
    affectedPopulation,
    reports,
    locationRisk,
    slaUrgency
}) {
    validateInput({
        severity,
        affectedPopulation,
        reports,
        locationRisk,
        slaUrgency
    });

    const severityScore = SEVERITY_SCORE[severity] / 3;

    const populationScore =
        normalizePopulation(affectedPopulation);

    const reportsScore =
        normalizeReports(reports);

    const priority =
        severityScore * 0.35 +
        populationScore * 0.25 +
        reportsScore * 0.15 +
        locationRisk * 0.15 +
        slaUrgency * 0.10;

    const score = Math.round(priority * 100);

    let level;

    if (score >= 80) {
        level = "CRITICAL";
    } else if (score >= 60) {
        level = "HIGH";
    } else if (score >= 30) {
        level = "MEDIUM";
    } else {
        level = "LOW";
    }

    return {
        score,
        level
    };
}