// The clients keep a state of 4 things:
// 1) changes present locally but not sent to the server.
// 2) the most recent version of the doc sent by the server
// 3) changes sent to the server but not acknowledged by the server
// 4) the current version of the doc visible to the user.
import differ, { revertChange } from "deep-diff";
import { decompress } from "./compression.client";
export function calculateDiff(oldDoc, newDoc) {
    const prefilter = (path, key) => {
        return ["undoState"].includes(key);
    };
    return differ(oldDoc, newDoc, prefilter);
}
export function deltaCompress(oldDoc, newDoc) {
    return calculateDiff(oldDoc, newDoc);
}
export function revertDiff(doc, diff) {
    if (!diff) {
        console.warn("No diff provided to revert");
        return doc;
    }
    try {
        const source = JSON.parse(JSON.stringify(doc));
        const target = JSON.parse(JSON.stringify(doc));
        for (const d of diff.reverse()) {
            revertChange(target, source, d);
        }
        return target;
    }
    catch (e) {
        console.error("Error reverting diff", e);
        return doc;
    }
}
export async function revertCompressedDiff(base64String, doc) {
    try {
        const { parsedString } = await decompress(base64String);
        return revertDiff(doc, parsedString);
    }
    catch (e) {
        console.error("Error decompressing diff", e);
        return doc;
    }
}
//# sourceMappingURL=deltaCompression.js.map