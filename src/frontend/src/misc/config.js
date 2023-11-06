const apiBase = '$VITE_API_BASE';
const zoteroKey = '$VITE_ZOTERO_KEY';

export const getApiBase = () => getVar(apiBase, '/api');
export const getZoteroKey = () => getVar(zoteroKey);

function getVar(key, defaultValue = null) {
    if (key.startsWith('$VITE_'))
        return import.meta.env[key.substring(1)] || defaultValue;
    return key || defaultValue;
}
