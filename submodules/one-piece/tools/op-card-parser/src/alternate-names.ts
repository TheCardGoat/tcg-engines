/** Rule-level aliases remain card metadata in every zone. */
export function parseAlternateNames(text: string): string[] {
  return [
    ...new Set(
      [
        ...text.matchAll(
          /Also treat this card['’]s name as \[([^\]]+)\] according to the rules\./gi,
        ),
      ].map((match) => match[1]!.trim()),
    ),
  ];
}
export function renderAlternateNames(names: readonly string[] | undefined): string | undefined {
  return names?.length ? `  alternateNames: ${JSON.stringify(names)},` : undefined;
}
