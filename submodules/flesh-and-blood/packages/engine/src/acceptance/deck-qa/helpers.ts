import { dash } from "../../../../cards/src/cards/heroes/dash.ts";
import { wreckerRompBlue } from "../../../../cards/src/cards/actions/wrecker-romp.ts";

import { FabTestEngine } from "../../testing/index.ts";

export const emptyDash = { hero: dash, hand: [] as const, life: 20, deck: 8 } as const;

export const manual = { autoPassPriority: false, autoPitch: false, pitchStack: "manual" } as const;

export function toDefend(game: FabTestEngine): void {
  game.advanceCombatTo("defend");
}

export function missBlockAndClose(game: FabTestEngine): void {
  game.as(dash).must.defend();
  game.helpers.resolveUntilIdle({ ordering: "listed", optionalBoolean: false });
}

export function sixPowerDeck() {
  return [
    wreckerRompBlue,
    wreckerRompBlue,
    wreckerRompBlue,
    wreckerRompBlue,
    wreckerRompBlue,
    wreckerRompBlue,
    wreckerRompBlue,
    wreckerRompBlue,
  ] as const;
}
