import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, st01Jinbe005 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("ST01-005 Jinbe", () => {
  test("with one attached DON!! gives an optional other Leader or Character +1000 for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: st01Jinbe005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
        activeDon: 1,
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jinbeId = engine.findCardInZone("south", "character", st01Jinbe005);
    const allyId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const leaderId = engine.leader("south");
    engine.attachDon(jinbeId, 1, "south");

    engine.declareAttack(jinbeId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Jinbe's power target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(leaderId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(allyId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(jinbeId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [allyId] }, "south");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === allyId)
        ?.power,
    ).toBe(8000);
    engine.endTurn("south");
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.power).toBe(
      7000,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("without an attached DON!! does not offer the power target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [
          { card: st01Jinbe005, playedOnTurn: 0 },
          { card: eb01MountainGod018, playedOnTurn: 0 },
        ],
      },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const jinbeId = engine.findCardInZone("south", "character", st01Jinbe005);
    const allyId = engine.findCardInZone("south", "character", eb01MountainGod018);

    engine.declareAttack(jinbeId, engine.leader("north"), "south");

    expect(() => engine.pendingDecision("effectTargetSelection", "south")).toThrow();
    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === allyId)?.power).toBe(
      7000,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
