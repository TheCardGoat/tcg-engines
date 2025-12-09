export function exhaustiveCheck(_) {
    if (process.env.NODE_ENV !== "production") {
        throw new Error(`Unexpected value: ${_}`);
    }
    // In production, we can just ignore the error
    console.error(`Unexpected value: ${_}`);
}
//# sourceMappingURL=exhaustiveCheck.js.map