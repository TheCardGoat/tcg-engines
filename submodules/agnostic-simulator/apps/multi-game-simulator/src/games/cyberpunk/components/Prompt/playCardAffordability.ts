export function unaffordablePlayReason(
  cost: number | undefined,
  available: number | undefined,
): string | undefined {
  if (typeof cost !== "number" || typeof available !== "number" || cost <= available) {
    return undefined;
  }
  return `Needs ${cost} €$ · ${available} available`;
}

export function playCardPromptCopy(available: number | undefined): {
  title: string;
  subtitle: string;
} {
  const remaining = typeof available === "number" ? ` You have ${available} €$ left.` : "";
  return {
    title: "Choose a Program to play",
    subtitle: `You still pay its Eddie cost.${remaining} Cards you cannot pay are dimmed.`,
  };
}
