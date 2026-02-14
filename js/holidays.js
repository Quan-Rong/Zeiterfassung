/**
 * holidays.js — NRW (Nordrhein-Westfalen) 法定节假日模块
 * 
 * 提供 NRW 州所有法定节假日的计算，包括基于复活节的浮动节假日。
 * 使用 Gauss 算法计算复活节日期。
 */

const Holidays = (() => {

    /**
     * 使用 Anonymous Gregorian (Gauss) 算法计算复活节日期
     */
    function getEasterDate(year) {
        const a = year % 19;
        const b = Math.floor(year / 100);
        const c = year % 100;
        const d = Math.floor(b / 4);
        const e = b % 4;
        const f = Math.floor((b + 8) / 25);
        const g = Math.floor((b - f + 1) / 3);
        const h = (19 * a + b - d - g + 15) % 30;
        const i = Math.floor(c / 4);
        const k = c % 4;
        const l = (32 + 2 * e + 2 * i - h - k) % 7;
        const m = Math.floor((a + 11 * h + 22 * l) / 451);
        const month = Math.floor((h + l - 7 * m + 114) / 31);
        const day = ((h + l - 7 * m + 114) % 31) + 1;
        return new Date(year, month - 1, day);
    }

    /**
     * 辅助：在日期上加减天数
     */
    function addDays(date, days) {
        const result = new Date(date);
        result.setDate(result.getDate() + days);
        return result;
    }

    /**
     * 格式化日期为 YYYY-MM-DD
     */
    function formatDate(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, '0');
        const d = String(date.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    }

    /**
     * 获取指定年份的 NRW 法定节假日
     * 返回 Map<string, string>：日期字符串 -> 节假日名称
     */
    function getNRWHolidays(year) {
        const easter = getEasterDate(year);
        const holidays = new Map();

        // 固定节假日
        holidays.set(`${year}-01-01`, 'Neujahr');
        holidays.set(`${year}-05-01`, 'Tag der Arbeit');
        holidays.set(`${year}-10-03`, 'Tag der Deutschen Einheit');
        holidays.set(`${year}-11-01`, 'Allerheiligen');
        holidays.set(`${year}-12-25`, '1. Weihnachtstag');
        holidays.set(`${year}-12-26`, '2. Weihnachtstag');

        // 基于复活节的浮动节假日
        holidays.set(formatDate(addDays(easter, -2)), 'Karfreitag');
        holidays.set(formatDate(addDays(easter, 1)), 'Ostermontag');
        holidays.set(formatDate(addDays(easter, 39)), 'Christi Himmelfahrt');
        holidays.set(formatDate(addDays(easter, 50)), 'Pfingstmontag');
        holidays.set(formatDate(addDays(easter, 60)), 'Fronleichnam');

        return holidays;
    }

    // 缓存
    const cache = {};

    function getHolidaysForYear(year) {
        if (!cache[year]) {
            cache[year] = getNRWHolidays(year);
        }
        return cache[year];
    }

    /**
     * 判断某日期是否为 NRW 节假日
     */
    function isHoliday(date) {
        const year = date.getFullYear();
        const key = formatDate(date);
        return getHolidaysForYear(year).has(key);
    }

    /**
     * 获取节假日名称，若非节假日返回 null
     */
    function getHolidayName(date) {
        const year = date.getFullYear();
        const key = formatDate(date);
        return getHolidaysForYear(year).get(key) || null;
    }

    /**
     * 判断是否为周末
     */
    function isWeekend(date) {
        const day = date.getDay();
        return day === 0 || day === 6;
    }

    /**
     * 判断是否为非工作日（周末或节假日）
     */
    function isNonWorkingDay(date) {
        return isWeekend(date) || isHoliday(date);
    }

    /**
     * 获取日期对应的 Emoji
     */
    function getDayEmoji(date) {
        if (isHoliday(date)) return '🎉';
        if (isWeekend(date)) return '🏡';
        return '';
    }

    return {
        getNRWHolidays,
        isHoliday,
        getHolidayName,
        isWeekend,
        isNonWorkingDay,
        getEasterDate,
        getDayEmoji
    };
})();
