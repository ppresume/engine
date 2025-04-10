import { describe, expect, it, vi } from 'vitest'

import { LocaleLanguage } from '../data'
import {
  getDateRange,
  localizeDate,
  parseDate,
  nowInUTCSeconds,
  epochSecondsToLocaleDateString,
  milliSecondsToSeconds,
} from './date'

describe(parseDate, () => {
  it('should return null for invalid date string', () => {
    for (const dateStr of [null, undefined, '', 'hello', '2020-13-01']) {
      expect(parseDate(dateStr)).toBeNull()
    }
  })

  it('should return Date object for valid date string', () => {
    for (const dateStr of ['2020', '2020-01', '2020-02-03']) {
      const parsedDate = parseDate(dateStr)

      expect(parsedDate).toBeInstanceOf(Date)
      expect(parsedDate?.getFullYear()).toBe(2020)
    }
  })

  it('should handle exception if Date constructor throws an error', () => {
    vi.spyOn(global, 'Date').mockImplementation((dateStr) => {
      throw new Error('Invalid date format')
    })

    expect(parseDate('2020-01-01')).toBeNull()

    vi.restoreAllMocks()
  })
})

describe(localizeDate, () => {
  it('should get localized date based on language option', () => {
    const tests = [
      {
        date: 'Oct 1, 2016',
        language: LocaleLanguage.English,
        expected: 'Oct 2016',
      },
      {
        date: 'Oct 1, 2016',
        language: LocaleLanguage.Spanish,
        expected: 'oct 2016',
      },
      {
        date: 'Oct 1, 2016',
        language: LocaleLanguage.SimplifiedChinese,
        expected: '2016年10月',
      },
      {
        date: 'Oct 1, 2016',
        language: LocaleLanguage.TraditionalChineseHK,
        expected: '2016年10月',
      },
      {
        date: 'Oct 1, 2016',
        language: LocaleLanguage.TraditionalChineseTW,
        expected: '2016年10月',
      },
      {
        date: '',
        language: LocaleLanguage.English,
        expected: '',
      },
      {
        date: '',
        language: LocaleLanguage.Spanish,
        expected: '',
      },
      {
        date: '',
        language: LocaleLanguage.SimplifiedChinese,
        expected: '',
      },
      {
        date: '',
        language: LocaleLanguage.TraditionalChineseHK,
        expected: '',
      },
      {
        date: '',
        language: LocaleLanguage.TraditionalChineseTW,
        expected: '',
      },
    ]

    for (const { date, language, expected } of tests) {
      expect(localizeDate(date, language)).toEqual(expected)
    }
  })
})

describe(getDateRange, () => {
  it('should return correct date range', () => {
    const tests = [
      {
        startDate: 'Oct 1, 2016',
        endDate: 'Jan 1, 2018',
        language: LocaleLanguage.English,
        expected: 'Oct 2016 -- Jan 2018',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: '',
        language: LocaleLanguage.English,
        expected: 'Oct 2016 -- Present',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: '',
        language: '',
        expected: 'Oct 2016 -- Present',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: 'Jan 1, 2018',
        language: LocaleLanguage.Spanish,
        expected: 'oct 2016 -- ene 2018',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: '',
        language: LocaleLanguage.Spanish,
        expected: 'oct 2016 hasta la fecha',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: 'Jan 1, 2018',
        language: LocaleLanguage.SimplifiedChinese,
        expected: '2016年10月 -- 2018年1月',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: '',
        language: LocaleLanguage.SimplifiedChinese,
        expected: '2016年10月至今',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: 'Jan 1, 2018',
        language: LocaleLanguage.TraditionalChineseHK,
        expected: '2016年10月 -- 2018年1月',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: '',
        language: LocaleLanguage.TraditionalChineseHK,
        expected: '2016年10月至今',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: 'Jan 1, 2018',
        language: LocaleLanguage.TraditionalChineseTW,
        expected: '2016年10月 -- 2018年1月',
      },
      {
        startDate: 'Oct 1, 2016',
        endDate: '',
        language: LocaleLanguage.TraditionalChineseTW,
        expected: '2016年10月至今',
      },
      {
        startDate: '',
        endDate: '',
        language: LocaleLanguage.English,
        expected: '',
      },
      {
        startDate: '',
        endDate: 'Jan 1, 2018',
        language: LocaleLanguage.English,
        expected: '',
      },
    ]

    for (const { startDate, endDate, language, expected } of tests) {
      expect(getDateRange(startDate, endDate, language)).toEqual(expected)
    }
  })
})

describe(nowInUTCSeconds, () => {
  it('should return the current time in UTC seconds', () => {
    expect(nowInUTCSeconds()).toBe(Math.floor(Date.now() / 1000))
  })
})

describe(epochSecondsToLocaleDateString, () => {
  it('should return the date in the locale format', () => {
    expect(epochSecondsToLocaleDateString(1617235200)).toBe('Apr 1, 2021')
  })
})

describe(milliSecondsToSeconds, () => {
  it('should return the milliseconds in seconds', () => {
    expect(milliSecondsToSeconds(1000)).toBe(1)
  })
})
