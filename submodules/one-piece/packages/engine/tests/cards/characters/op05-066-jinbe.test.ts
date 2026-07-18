import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, op05Jinbe066 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-066 Jinbe", () => {
  test("at 10 DON!! on the opponent's turn, gains power and redirects an attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op05Jinbe066], activeDon: 10 },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const jinbeId = engine.findCardInZone("south", "character", op05Jinbe066);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const jinbe = engine
      .getView("south")
      .players.south.characters.find((card) => card?.instanceId === jinbeId);
    expect(jinbe?.power).toBe(7000);

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Jinbe's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(jinbeId);
    engine.resolveDecision("battleBlocker", { selectedIds: [jinbeId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === jinbeId)?.rested).toBe(
      true,
    );
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(jinbeId);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not gain the permanent power on its own turn or below 10 DON!!", () => {
    const ownTurn = OnePieceTestEngine.create(
      { character: [op05Jinbe066], activeDon: 10 },
      {},
      { firstPlayer: "north", activeSeat: "south" },
    );
    const ownTurnId = ownTurn.findCardInZone("south", "character", op05Jinbe066);
    expect(
      ownTurn
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === ownTurnId)?.power,
    ).toBe(6000);

    const nineDon = OnePieceTestEngine.create(
      { character: [op05Jinbe066], activeDon: 9 },
      {},
      { firstPlayer: "south", activeSeat: "north" },
    );
    const nineDonId = nineDon.findCardInZone("south", "character", op05Jinbe066);
    expect(
      nineDon
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === nineDonId)?.power,
    ).toBe(6000);
  });
});
