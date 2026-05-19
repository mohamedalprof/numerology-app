// ============================================
// 🧪 UNIT TESTS: Numerology Calculation Engine
// Tests the core algorithm functions
// ============================================

import {
  sumDigits,
  reduceNumber,
  getCategory,
  calculateCompatibility,
  POSITIVE_NUMBERS,
  NEGATIVE_NUMBERS,
  MEDIUM_NUMBERS,
} from '../numerology'

// ============================================
// 1. sumDigits() Tests
// ============================================
describe('sumDigits', () => {
  it('should sum digits of a single digit number', () => {
    expect(sumDigits(5)).toBe(5)
  })

  it('should sum digits of a two-digit number', () => {
    expect(sumDigits(23)).toBe(5) // 2 + 3 = 5
  })

  it('should sum digits of a year', () => {
    expect(sumDigits(1997)).toBe(26) // 1 + 9 + 9 + 7 = 26
  })

  it('should sum digits of 1968', () => {
    expect(sumDigits(1968)).toBe(24) // 1 + 9 + 6 + 8 = 24
  })

  it('should sum digits of 0', () => {
    expect(sumDigits(0)).toBe(0)
  })

  it('should sum digits of 12', () => {
    expect(sumDigits(12)).toBe(3) // 1 + 2 = 3
  })

  it('should sum digits of 2000', () => {
    expect(sumDigits(2000)).toBe(2) // 2 + 0 + 0 + 0 = 2
  })

  it('should sum digits of 1990', () => {
    expect(sumDigits(1990)).toBe(19) // 1 + 9 + 9 + 0 = 19
  })

  it('should sum digits of a day (29)', () => {
    expect(sumDigits(29)).toBe(11) // 2 + 9 = 11
  })

  it('should sum digits of a month (12)', () => {
    expect(sumDigits(12)).toBe(3) // 1 + 2 = 3
  })
})

// ============================================
// 2. reduceNumber() Tests
// ============================================
describe('reduceNumber', () => {
  it('should return numbers less than 22 as-is', () => {
    for (let i = 1; i <= 21; i++) {
      expect(reduceNumber(i)).toBe(i)
    }
  })

  it('should map 0 to 22 (Master Number)', () => {
    expect(reduceNumber(0)).toBe(22)
  })

  it('should reduce 22 to 22 (22-22=0, 0->22)', () => {
    expect(reduceNumber(22)).toBe(22)
  })

  it('should reduce 44 to 22 (44-22=22, 22-22=0->22)', () => {
    expect(reduceNumber(44)).toBe(22)
  })

  it('should reduce 23 to 1', () => {
    expect(reduceNumber(23)).toBe(1) // 23 - 22 = 1
  })

  it('should reduce 45 to 1', () => {
    expect(reduceNumber(45)).toBe(1) // 45 - 22 = 23, 23 - 22 = 1
  })

  it('should reduce 66 to 22', () => {
    // 66 - 22 = 44, 44 - 22 = 22, 22 - 22 = 0 -> 22
    expect(reduceNumber(66)).toBe(22)
  })

  it('should reduce 58 to 14', () => {
    expect(reduceNumber(58)).toBe(14) // 58 - 22 = 36, 36 - 22 = 14
  })

  it('should reduce 50 to 6', () => {
    expect(reduceNumber(50)).toBe(6) // 50 - 22 = 28, 28 - 22 = 6
  })

  it('should reduce 100 to 12', () => {
    // 100 - 22 = 78, 78 - 22 = 56, 56 - 22 = 34, 34 - 22 = 12
    expect(reduceNumber(100)).toBe(12)
  })

  it('should reduce 1 to 1', () => {
    expect(reduceNumber(1)).toBe(1)
  })

  it('should reduce 21 to 21', () => {
    expect(reduceNumber(21)).toBe(21)
  })

  it('should handle the غيداء/محمد example', () => {
    // غيداء: day=22, month=2, year=1988
    // محمد: day=16, month=4, year=1984
    // sum1 = 4 + 2 + 26 = 32
    // sum2 = 7 + 4 + 22 = 33
    // total = 65
    // reduceNumber(65) = 65 - 22 = 43, 43 - 22 = 21
    expect(reduceNumber(65)).toBe(21)
  })

  it('should always return a number between 1 and 22', () => {
    for (let i = 0; i <= 200; i++) {
      const result = reduceNumber(i)
      expect(result).toBeGreaterThanOrEqual(1)
      expect(result).toBeLessThanOrEqual(22)
    }
  })

  it('should never return 0', () => {
    for (let i = 0; i <= 200; i++) {
      const result = reduceNumber(i)
      expect(result).not.toBe(0)
    }
  })

  it('should handle large numbers', () => {
    // 200 - 22*9 = 200 - 198 = 2
    expect(reduceNumber(200)).toBe(2)
  })
})

// ============================================
// 3. getCategory() Tests
// ============================================
describe('getCategory', () => {
  describe('Positive numbers (2, 3, 5, 6, 10, 14, 17, 19, 21)', () => {
    POSITIVE_NUMBERS.forEach(num => {
      it(`should classify ${num} as positive`, () => {
        expect(getCategory(num)).toBe('positive')
      })
    })
  })

  describe('Negative numbers (9, 12, 13, 15, 16, 18, 22)', () => {
    NEGATIVE_NUMBERS.forEach(num => {
      it(`should classify ${num} as negative`, () => {
        expect(getCategory(num)).toBe('negative')
      })
    })
  })

  describe('Medium numbers (1, 4, 7, 8, 11, 20)', () => {
    MEDIUM_NUMBERS.forEach(num => {
      it(`should classify ${num} as medium`, () => {
        expect(getCategory(num)).toBe('medium')
      })
    })
  })

  it('should cover all numbers 1-22 exactly once', () => {
    const allNumbers = [...POSITIVE_NUMBERS, ...NEGATIVE_NUMBERS, ...MEDIUM_NUMBERS]
    for (let i = 1; i <= 22; i++) {
      expect(allNumbers).toContain(i)
    }
    expect(allNumbers.length).toBe(22)
  })

  it('should have no duplicates in classification', () => {
    const allNumbers = [...POSITIVE_NUMBERS, ...NEGATIVE_NUMBERS, ...MEDIUM_NUMBERS]
    const uniqueNumbers = [...new Set(allNumbers)]
    expect(uniqueNumbers.length).toBe(allNumbers.length)
  })

  it('should classify exactly 9 numbers as positive', () => {
    expect(POSITIVE_NUMBERS.length).toBe(9)
  })

  it('should classify exactly 7 numbers as negative', () => {
    expect(NEGATIVE_NUMBERS.length).toBe(7)
  })

  it('should classify exactly 6 numbers as medium', () => {
    expect(MEDIUM_NUMBERS.length).toBe(6)
  })
})

// ============================================
// 4. calculateCompatibility() Full Integration
// ============================================
describe('calculateCompatibility', () => {
  it('should always return a number between 1 and 22', () => {
    const result = calculateCompatibility(1, 1, 1990, 1, 1, 1990)
    expect(result).toBeGreaterThanOrEqual(1)
    expect(result).toBeLessThanOrEqual(22)
  })

  it('غيداء (22/2/1988) + محمد (16/4/1984) = 21', () => {
    const result = calculateCompatibility(22, 2, 1988, 16, 4, 1984)
    expect(result).toBe(21)
    expect(getCategory(result)).toBe('positive')
  })

  it('should handle same birth dates', () => {
    const result = calculateCompatibility(15, 6, 1990, 15, 6, 1990)
    // sum1 = 6 + 6 + 19 = 31, sum2 = 31, total = 62
    // 62 - 22 = 40, 40 - 22 = 18
    expect(result).toBe(18)
    expect(getCategory(result)).toBe('negative')
  })

  it('should produce result 22 for dates summing to 66', () => {
    // Person1(2,9,1999) + Person2(2,3,1984)
    // sum1 = 2+9+28 = 39, sum2 = 2+3+22 = 27
    // total = 66, reduceNumber(66) = 22
    const result = calculateCompatibility(2, 9, 1999, 2, 3, 1984)
    expect(result).toBe(22)
    expect(getCategory(result)).toBe('negative')
  })

  it('should produce consistent results for same inputs', () => {
    const r1 = calculateCompatibility(15, 6, 1990, 20, 3, 1985)
    const r2 = calculateCompatibility(15, 6, 1990, 20, 3, 1985)
    expect(r1).toBe(r2)
  })

  it('should be able to produce all 22 result numbers', () => {
    const results = new Set<number>()
    for (let d1 = 1; d1 <= 28; d1 += 3) {
      for (let m1 = 1; m1 <= 12; m1 += 2) {
        for (let y1 = 1960; y1 <= 2000; y1 += 10) {
          for (let d2 = 1; d2 <= 28; d2 += 5) {
            for (let m2 = 1; m2 <= 12; m2 += 3) {
              for (let y2 = 1960; y2 <= 2000; y2 += 10) {
                results.add(calculateCompatibility(d1, m1, y1, d2, m2, y2))
              }
            }
          }
        }
      }
    }
    for (let i = 1; i <= 22; i++) {
      expect(results.has(i)).toBe(true)
    }
  })

  it('day1=10, month1=5, year1=1995, day2=14, month2=8, year2=1992', () => {
    // sum1 = 1 + 5 + 24 = 30, sum2 = 5 + 8 + 21 = 34
    // total = 64, 64-22=42, 42-22=20
    const result = calculateCompatibility(10, 5, 1995, 14, 8, 1992)
    expect(result).toBe(20)
    expect(getCategory(result)).toBe('medium')
  })

  it('should handle early years', () => {
    // day1=1, month1=1, year1=1940, day2=1, month2=1, year2=1940
    // sum1 = 1+1+14=16, sum2=16, total=32, 32-22=10
    const result = calculateCompatibility(1, 1, 1940, 1, 1, 1940)
    expect(result).toBe(10)
    expect(getCategory(result)).toBe('positive')
  })

  it('should handle year 2000+ correctly', () => {
    // day1=1, month1=1, year1=2005, day2=1, month2=1, year2=2005
    // sum1 = 1+1+7=9, sum2=9, total=18
    expect(calculateCompatibility(1, 1, 2005, 1, 1, 2005)).toBe(18)
  })
})
