
const SUFFIXES = ["", "k", "m", "b", "t", "qa", "qi", "sx", "sp", "oc", "no", "dc"];

export function formatNumber(num: number): string {
    if (num === 0) return "0";
    if (num < 0) return "-" + formatNumber(-num);

    if (num < 1000) {
        // If close to integer, show as integer
        if (Math.abs(num - Math.round(num)) < 0.1) {
            return Math.round(num).toLocaleString();
        }
        // Otherwise show 1 decimal place for small numbers (like CPS)
        return num.toFixed(1);
    }

    const tier = Math.floor(Math.log10(num) / 3);

    if (tier >= SUFFIXES.length) return num.toExponential(2);

    const suffix = SUFFIXES[tier];
    const scaled = num / Math.pow(10, tier * 3);

    return scaled.toFixed(2).replace(/\.00$/, '').replace(/(\.[0-9])0$/, '$1') + suffix;
}
