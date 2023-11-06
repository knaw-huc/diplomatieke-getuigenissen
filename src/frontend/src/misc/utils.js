export function getHashData() {
    if (window.location.hash.startsWith('#')) {
        const params = new URLSearchParams(window.location.hash.substring(1));
        return {
            s: params.has('s') ? parseInt(params.get('s')) : 1,
            t: params.has('t') ? parseFloat(params.get('t')) : 0
        };
    }
    return {s: 1, t: 0};
}

export function getHash(t, s) {
    const hashData = getHashData();
    t ??= hashData.t;
    s ??= hashData.s;
    return `#s=${s}&t=${t}`;
}

export function getTimeHash(t) {
    t ??= getHashData().t;
    return t > 0 ? `#t=${t}` : '';
}

export function getSeconds(duration) {
    const parts = duration.split(':');
    return parseInt(parts[0]) * 60 * 60 + parseInt(parts[1]) * 60 + parseInt(parts[2]);
}

export const getDuration = seconds => new Date(seconds * 1000).toISOString().substring(11, 19);

export const getDurationInPercentage = (seconds, duration) => (seconds / duration) * 100;

export const getNLDate = date => new Date(date).toLocaleDateString('nl-NL');
