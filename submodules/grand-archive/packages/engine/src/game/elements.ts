import { GRAND_ARCHIVE_ELEMENTS, type GrandArchiveElement } from "@tcg/grand-archive-types";
import { grandArchiveObjectCurrentCharacteristics } from "../rules/state/continuous.ts";
import type { GrandArchivePlayerId } from "./identity.ts";
import type { GrandArchiveMatchProgram } from "../kernel/match-program.ts";
import type { GrandArchiveMatchState } from "./model.ts";
import { grandArchivePlayerHasState } from "../rules/state/player-continuous.ts";
import { grandArchiveObjectFace } from "./card-runtime.ts";

const BASIC_ELEMENTS = new Set<GrandArchiveElement>(["FIRE", "WATER", "WIND"]);

export function grandArchiveElementIsAdvanced(element: GrandArchiveElement): boolean {
  return element !== "NORM" && !BASIC_ELEMENTS.has(element);
}

function addChampionEnabledElement(
  elements: Set<GrandArchiveElement>,
  element: GrandArchiveElement,
) {
  // Exalted cannot enable itself. Its special rule requires another advanced
  // element enabled by a champion before it is added below.
  if (element !== "EXALTED") elements.add(element);
}

/** Authoritative special-element enablement for every play method. */
export function grandArchivePlayerEnabledElements(
  program: GrandArchiveMatchProgram,
  state: GrandArchiveMatchState,
  playerId: GrandArchivePlayerId,
): ReadonlySet<GrandArchiveElement> {
  const elements = new Set<GrandArchiveElement>(["NORM"]);
  const champions = Object.values(state.objects).filter(
    (object) =>
      object.controllerId === playerId &&
      object.zone === "field" &&
      grandArchiveObjectCurrentCharacteristics(program, state, object).types.includes("CHAMPION"),
  );
  for (const champion of champions) {
    // Leveling preserves the Spirit object and changes its active definition.
    // Its original card remains in the lineage (Champion / General Rules 5;
    // Leveling Up 7.2.2), so its element still enables the player's cards.
    const lineage = Object.values(state.objects).filter(
      (card) => card.hostId === champion.id && card.zone === "inner-lineage",
    );
    if (lineage.length > 0) {
      const base = grandArchiveObjectFace(program, { ...champion, activeDefinitionId: undefined });
      if (base.typeLine.types.includes("CHAMPION")) {
        for (const element of base.elements) addChampionEnabledElement(elements, element);
      }
    }
    for (const element of grandArchiveObjectCurrentCharacteristics(program, state, champion)
      .elements) {
      addChampionEnabledElement(elements, element);
    }
    for (const lineageCard of lineage) {
      const characteristics = grandArchiveObjectCurrentCharacteristics(program, state, lineageCard);
      if (!characteristics.types.includes("CHAMPION")) continue;
      for (const element of characteristics.elements) {
        addChampionEnabledElement(elements, element);
      }
    }
  }
  for (const element of BASIC_ELEMENTS) {
    if (
      grandArchivePlayerHasState(program, state, playerId, {
        named: "enabled-element",
        value: element,
      })
    ) {
      elements.add(element);
    }
  }
  if (
    grandArchivePlayerHasState(program, state, playerId, {
      named: "enabled-element",
      value: "ALL",
    })
  ) {
    for (const element of GRAND_ARCHIVE_ELEMENTS) elements.add(element);
  }
  if (
    [...elements].some((element) => element !== "EXALTED" && grandArchiveElementIsAdvanced(element))
  ) {
    elements.add("EXALTED");
  }
  return elements;
}
