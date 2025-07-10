// @ts-ignore
export function exhaustiveCheck(x: never): never {
  const data = JSON.stringify(x || "");
  console.error(`Exhaustive check failed: ${data}`);
}
