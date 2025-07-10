export function exhaustiveCheck(_: never) {
  if (process.env.NODE_ENV !== "production") {
    throw new Error(`Unexpected value: ${_}`);
  }
  // In production, we can just ignore the error
  console.error(`Unexpected value: ${_}`);
}
