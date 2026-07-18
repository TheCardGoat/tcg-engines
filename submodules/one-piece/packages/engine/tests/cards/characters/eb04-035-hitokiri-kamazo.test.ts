import { describe, expect, test } from "vite-plus/test";
import {
  eb01Kalifa031,
  eb01MountainGod018,
  op10EustassCaptainKid099,
  op14eb04HitokiriKamazo035,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB04-035 Hitokiri Kamazo", () => {
  test("once per turn adds one rested DON!! after its controller returns DON!!", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op10EustassCaptainKid099,
      hand: [eb01Kalifa031, eb01Kalifa031],
      character: [op14eb04HitokiriKamazo035],
      activeDon: 12,
      donDeckCount: 1,
    });

    engine.playCard(eb01Kalifa031, "south");
    const firstReturn = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(firstReturn?.kind).toBe("payCost");
    if (firstReturn?.kind !== "payCost") throw new Error("Expected Kalifa's DON!! return.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [firstReturn.candidates[0]!.ref.id] },
      "south",
    );
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 6,
      restedDon: 6,
      donDeckCount: 1,
    });

    engine.playCard(eb01Kalifa031, "south");
    const secondReturn = engine.pendingDecision("effectCostReturnDon", "south").steps[0];
    expect(secondReturn?.kind).toBe("payCost");
    if (secondReturn?.kind !== "payCost") throw new Error("Expected Kalifa's second DON!! return.");
    engine.resolveDecision(
      "effectCostReturnDon",
      { selectedIds: [secondReturn.candidates[0]!.ref.id] },
      "south",
    );

    expect(engine.getView("south").players.south).toMatchObject({
      activeDon: 0,
      restedDon: 11,
      donDeckCount: 2,
    });
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("blocks an opponent's attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04HitokiriKamazo035] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const kamazoId = engine.findCardInZone("south", "character", op14eb04HitokiriKamazo035);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    const blocker = engine.pendingDecision("battleBlocker", "south").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Kamazo's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(kamazoId);
    engine.resolveDecision("battleBlocker", { selectedIds: [kamazoId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });
});
