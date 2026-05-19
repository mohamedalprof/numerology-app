// ============================================
// 🔢 NUMEROLOGY CALCULATION ENGINE
// Core algorithm functions - extracted for testability
// ============================================

// Classification constants
export const POSITIVE_NUMBERS = [2, 3, 5, 6, 10, 14, 17, 19, 21]
export const NEGATIVE_NUMBERS = [9, 12, 13, 15, 16, 18, 22]
export const MEDIUM_NUMBERS = [1, 4, 7, 8, 11, 20]

/**
 * Sum all digits of a number
 * Example: sumDigits(1997) = 1+9+9+7 = 26
 */
export function sumDigits(num: number): number {
  return String(num).split('').reduce((sum, digit) => sum + parseInt(digit), 0)
}

/**
 * Reduce a number by subtracting 22 repeatedly until result < 22
 * Special case: 0 maps to 22 (Master Number)
 * Results are always 1-22
 */
export function reduceNumber(num: number): number {
  while (num >= 22) {
    num -= 22
  }
  return num === 0 ? 22 : num
}

/**
 * Get the category of a compatibility number
 * Returns: 'positive' | 'negative' | 'medium'
 */
export function getCategory(compatibility: number): 'positive' | 'negative' | 'medium' {
  if (POSITIVE_NUMBERS.includes(compatibility)) return 'positive'
  if (NEGATIVE_NUMBERS.includes(compatibility)) return 'negative'
  return 'medium'
}

/**
 * Full compatibility calculation from birth dates
 * Takes day, month, year for two people
 * Returns a number between 1 and 22
 */
export function calculateCompatibility(
  d1: number, m1: number, y1: number,
  d2: number, m2: number, y2: number
): number {
  const sum1 = sumDigits(d1) + sumDigits(m1) + sumDigits(y1)
  const sum2 = sumDigits(d2) + sumDigits(m2) + sumDigits(y2)
  const totalSum = sum1 + sum2
  return reduceNumber(totalSum)
}
