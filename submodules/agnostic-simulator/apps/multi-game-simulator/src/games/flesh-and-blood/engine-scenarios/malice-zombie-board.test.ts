import { describe, expect, it } from "vitest";

import { presentRuntime } from "../projection";
import { MALICE_ZOMBIE_BOARD_SCENARIOS } from "./malice-zombie-board";

describe("FAB engine scenario · Malice Zombie allies board", () => {
  it("seats Malice with Vox, Danse, Zombies in public zones, and a hand of Restless allies", () => {
    const scenario = MALICE_ZOMBIE_BOARD_SCENARIOS["malice-zombie-allies-board"];
    const match = scenario.boot();
    const state = presentRuntime(match.runtime, match.player1Id);
    const ownNames = (zone: string) =>
      Object.values(state.cards)
        .filter((card) => card.ownerId === match.player1Id && card.zone === zone)
        .map((card) => state.cardDefinitions[card.cardId]?.name);

    expect(scenario.viewerId).toBe("player-1");
    expect(ownNames("hero")).toEqual(["Malice, Domina of the Dead"]);
    expect(ownNames("weapon")).toEqual(["Vox Necropolis"]);
    expect(ownNames("legs")).toEqual(["Danse Macabre"]);
    expect(ownNames("permanent")).toEqual(["Restless Commander"]);
    expect(ownNames("graveyard")).toEqual([
      "Restless Cleric",
      "Restless Corporal",
      "Restless Magister",
    ]);
    expect(ownNames("banished")).toEqual(["Restless Looter", "Restless Plowman", "Restless Steed"]);
    expect(ownNames("hand")).toEqual([
      "Restless Cleric",
      "Restless Corporal",
      "Restless Looter",
      "Restless Magister",
      "Restless Outlaw",
      "Restless Plowman",
      "Restless Quartermaster",
      "Restless Shieldmaiden",
      "Restless Steed",
      "Restless Templar",
      "Hellbound Assault",
      "Ominous Toll",
      "Mark of Ushering",
    ]);

    const handCards = Object.values(state.cards).filter(
      (card) => card.ownerId === match.player1Id && card.zone === "hand",
    );
    expect(
      handCards.filter((card) => state.cardDefinitions[card.cardId]?.pitchValue === 3),
    ).toHaveLength(3);
  });
});
