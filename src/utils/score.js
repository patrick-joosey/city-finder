import { categories } from "../data/cities";

/**
 * Compute the user-weighted overall score for a city.
 *
 * The grid's "Sort by overall" and the Rankings dot plot both use this.
 * Keeping one implementation prevents drift between views.
 *
 * @param {object} city   - A city object with a .scores map (key → 1-10 number).
 * @param {object} weights - { [categoryKey]: multiplier } where multiplier is 0-3.
 *                           Weight 0 means the category is ignored.
 * @returns {number} Weighted average in [1, 10], or 0 when every weight is 0.
 */
export function getWeightedScore(city, weights) {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;
  const weightedSum = categories.reduce(
    (sum, cat) => sum + (city.scores[cat.key] || 0) * (weights[cat.key] || 0),
    0,
  );
  return weightedSum / totalWeight;
}
