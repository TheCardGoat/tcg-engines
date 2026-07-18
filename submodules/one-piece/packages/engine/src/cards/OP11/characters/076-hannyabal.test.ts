import { describe, expect, test } from "vite-plus/test";
import {
  eb01MountainGod018,
  op02Magellan071,
  op02Mr1DazBonez063,
  op02Mr3Galdino065,
} from "@tcg/op-cards";
import { op11Hannyabal076 } from "../../../../../cards/src/cards/OP11/characters/076-hannyabal.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP11-076 Hannyabal", () => {
  test("with an Impel Down Leader plays an included cost-3-or-less Character from hand", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op02Magellan071,
      hand: [op11Hannyabal076, op02Mr1DazBonez063, op02Mr3Galdino065],
      activeDon: op11Hannyabal076.cost,
    });
    const eligibleId = engine.findCardInZone("south", "hand", op02Mr1DazBonez063);
    const expensiveId = engine.findCardInZone("south", "hand", op02Mr3Galdino065);

    engine.playCard(op11Hannyabal076, "south");
    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (play?.kind !== "selectEntity") throw new Error("Expected Hannyabal's play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    expect(
      engine.getView("south").players.south.characters.map((card) => card?.instanceId),
    ).toContain(eligibleId);
  });

  test("can become the new target of an opponent's attack as a Blocker", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op11Hannyabal076] },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const hannyabalId = engine.findCardInZone("south", "character", op11Hannyabal076);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [hannyabalId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      hannyabalId,
    );
  });
});
