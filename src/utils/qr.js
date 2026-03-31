// Dynamic QR Engine (Build-Safe Version)
// We avoid btoa() to prevent Rollup binding issues in some environments.

const simpleHash = (str) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
    }
    return Math.abs(hash).toString(36).toUpperCase();
};

export const generateDynamicToken = (baseId) => {
    const timeWindow = Math.floor(Date.now() / 60000); // 1-minute window
    return `BMB-${simpleHash(`${baseId}-${timeWindow}`)}`.slice(0, 12);
};

export const validateDynamicToken = (token, baseId) => {
    const timeWindow = Math.floor(Date.now() / 60000);
    const expectedCurrent = `BMB-${simpleHash(`${baseId}-${timeWindow}`)}`.slice(0, 12);
    const expectedPrev = `BMB-${simpleHash(`${baseId}-${timeWindow - 1}`)}`.slice(0, 12);
    
    return token === expectedCurrent || token === expectedPrev;
};
