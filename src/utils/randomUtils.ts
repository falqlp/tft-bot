/**
 * Generates a random number following a normal (Gaussian) distribution.
 *
 * @param {number} [mean=0] - The mean (μ) of the normal distribution.
 * @param {number} [stdDev=1] - The standard deviation (σ) of the normal distribution.
 * @return {number} A random number sampled from the specified normal distribution.
 */
export function randomNormal(mean = 0, stdDev = 1): number {
    let u = 0, v = 0;
    while (u === 0) u = Math.random();
    while (v === 0) v = Math.random();
    const z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return mean + z * stdDev;
}

/**
 * Restricts a number to be within a specified range.
 *
 * @param {number} value - The number to be clamped.
 * @param {number} min - The lower boundary of the range.
 * @param {number} max - The upper boundary of the range.
 * @return {number} The clamped value, constrained between the min and max values.
 */
export function clamp(value: number, min: number, max: number): number {
    return Math.min(max, Math.max(min, value));
}