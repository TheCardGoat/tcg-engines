import { describe, expect, test } from "vite-plus/test";
import { eb01Fourtricks025, eb01MountainGod018, op11Shu088 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-088 Shu", () => {
  test("gains power against a Slash attacker, blocks, and only activates once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Shu088] },
      {
        character: [
          { card: eb01Fourtricks025, playedOnTurn: 0 },
          { card: eb01Fourtricks025, playedOnTurn: 0 },
        ],
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shuId = engine.findCardInZone("south", "character", op11Shu088);
    const [firstAttackerId, secondAttackerId] = engine
      .getView("north")
      .players.north.characters.filter((card) => card?.cardId === eb01Fourtricks025.id)
      .map((card) => card!.instanceId);

    engine.declareAttack(firstAttackerId!, engine.leader("south"), "north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === shuId)
        ?.power,
    ).toBe(10000);
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Shu as Blocker.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(shuId);
    engine.resolveDecision("battleBlocker", { selectedIds: [shuId] }, "south");

    engine.declareAttack(secondAttackerId!, engine.leader("south"), "north");
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === shuId)
        ?.power,
    ).toBe(5000);
  });

  test("does not gain power when the opposing attacking Character lacks Slash", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Shu088] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const shuId = engine.findCardInZone("south", "character", op11Shu088);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, engine.leader("south"), "north");

    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === shuId)
        ?.power,
    ).toBe(5000);
  });
});
