import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op09DonquixoteRosinante032 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP09-032 Donquixote Rosinante", () => {
  test("reactivates once on an opponent's attack so it can block that attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op09DonquixoteRosinante032, rested: true }] },
      {
        character: [
          { card: eb01Doma005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const attackerIds = engine
      .getState()
      .players.north.characterArea.filter((id): id is string => Boolean(id));
    const rosinanteId = engine.findCardInZone("south", "character", op09DonquixoteRosinante032);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerIds[0]!, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Rosinante's Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(rosinanteId);
    engine.resolveDecision("battleBlocker", { selectedIds: [rosinanteId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === rosinanteId)?.rested,
    ).toBe(true);

    engine.declareAttack(attackerIds[1]!, engine.leader("south"), "north");

    view = engine.getView("south");
    expect(view.players.south.lifeCount).toBe(lifeBefore - 1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === rosinanteId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });
});
