const objectHash = require("object-hash");
function isEmpty(value) {
    return (value === null ||
        value === undefined ||
        (Array.isArray(value) && value.length === 0)
    // (typeof value === "object" &&
    //   value !== null &&
    //   Object.keys(value).length === 0)
    );
}
export function cleanObject(obj, depth = 0, maxDepth = 40, visited = new WeakSet()) {
    if (depth > maxDepth) {
        return "[MaxDepthExceeded]";
    }
    if (obj === null || typeof obj !== "object") {
        return obj;
    }
    if (visited.has(obj)) {
        return "[Circular]";
    }
    visited.add(obj);
    if (Array.isArray(obj)) {
        const result = new Array(obj.length);
        for (let i = 0; i < obj.length; i++) {
            result[i] = cleanObject(obj[i], depth + 1, maxDepth, visited);
        }
        return result;
    }
    const result = {};
    const keys = Object.keys(obj);
    for (const key of keys) {
        const value = cleanObject(obj[key], depth + 1, maxDepth, visited);
        if (value !== null && value !== undefined && !isEmpty(value)) {
            result[key] = value;
        }
    }
    return result;
}
export function hash(data) {
    return objectHash.MD5(cleanObject(data), {
        excludeKeys: (key) => {
            return [
                "ctx.deltalog",
                "ctx._stateID",
                "ctx._redo",
                "ctx._undo",
            ].includes(key);
        },
    });
}
//# sourceMappingURL=state-hash.js.map