export type PracticeMode = "bot" | "self";

/** Missing and unknown values preserve the established bot-practice behavior. */
export function parsePracticeMode(value: string | null | undefined): PracticeMode {
  return value === "self" ? "self" : "bot";
}

export function practiceModeFromSearch(search: string | URLSearchParams): PracticeMode {
  const params = typeof search === "string" ? new URLSearchParams(search) : search;
  return parsePracticeMode(params.get("mode"));
}
