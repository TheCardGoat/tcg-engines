export async function copyTextToClipboard(text: string): Promise<boolean> {
  if (typeof navigator === "undefined" || !navigator.clipboard) {
    return false;
  }
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}

export function safeStringify(value: unknown): string {
  try {
    const seen = new WeakSet<object>();
    return JSON.stringify(
      value,
      (_key, nextValue) => {
        if (typeof nextValue === "object" && nextValue !== null) {
          if (seen.has(nextValue)) {
            return "[Circular]";
          }
          seen.add(nextValue);
        }
        if (typeof nextValue === "bigint") {
          return nextValue.toString();
        }
        return nextValue;
      },
      2,
    );
  } catch (error) {
    return `// failed to stringify: ${error instanceof Error ? error.message : String(error)}`;
  }
}
