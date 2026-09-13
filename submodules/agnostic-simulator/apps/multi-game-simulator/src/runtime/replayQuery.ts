export function parseNonNegativeIntegerQuery(value: string | null): number | null {
  if (value === null || !/^\d+$/.test(value)) return null;
  const parsed = Number.parseInt(value, 10);
  return Number.isSafeInteger(parsed) ? parsed : null;
}

export function syncReplayStepQuery(search: string, step: number): string {
  const params = new URLSearchParams(search);
  params.delete("stateVersion");
  if (step === 0) {
    params.delete("step");
  } else {
    params.set("step", String(step));
  }
  const query = params.toString();
  return query ? `?${query}` : "";
}
