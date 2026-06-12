import type { PlayerId } from "@tcg/cyberpunk-engine";

import type { CyberpunkCardZone, CyberpunkSimulatorPom } from "../cyberpunk-simulator-pom";

export async function getZoneDefinitionIds(
  pom: CyberpunkSimulatorPom,
  zone: CyberpunkCardZone,
  player: PlayerId,
): Promise<ReadonlyArray<string>> {
  return (await pom.getCardsInZone(zone, player)).map((card) => card.definitionId);
}

export function expectIncludes(
  label: string,
  values: ReadonlyArray<string>,
  expected: string,
): void {
  if (!values.includes(expected)) {
    throw new Error(`Expected ${label} to include ${expected}, got ${values.join(", ")}.`);
  }
}

export function expectExcludes(
  label: string,
  values: ReadonlyArray<string>,
  expected: string,
): void {
  if (values.includes(expected)) {
    throw new Error(`Expected ${label} not to include ${expected}, got ${values.join(", ")}.`);
  }
}

export async function getChoiceDefinitionIds(
  pom: CyberpunkSimulatorPom,
  cardIds: ReadonlyArray<string>,
): Promise<ReadonlyArray<string>> {
  return Promise.all(cardIds.map((cardId) => pom.getCardDefinitionId(cardId)));
}
