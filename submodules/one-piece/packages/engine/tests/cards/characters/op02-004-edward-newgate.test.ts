import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01CavendishBoxTopper008,
  op02EdwardNewgate004,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-004 Edward.Newgate", () => {
  test("boosts its Leader on play and prevents its controller from paying a Life-to-hand cost that turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op02EdwardNewgate004, op01CavendishBoxTopper008],
      life: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018],
      activeDon: op02EdwardNewgate004.cost + op01CavendishBoxTopper008.cost,
    });
    const leaderPower = engine.getView("south").players.south.leader.power;
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.playCard(op02EdwardNewgate004, "south");
    const boost = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(boost?.kind).toBe("selectEntity");
    if (boost?.kind !== "selectEntity") throw new Error("Expected Edward.Newgate's Leader choice.");
    expect(
      boost.candidates.find((candidate) => candidate.ref.id === engine.leader("south"))?.legal,
    ).toBe(true);
    engine.resolveDecision(
      "effectTargetSelection",
      { selectedIds: [engine.leader("south")] },
      "south",
    );

    expect(engine.getView("south").players.south.leader.power).toBe((leaderPower ?? 0) + 2000);
    engine.playCard(op01CavendishBoxTopper008, "south");
    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
    expect(engine.getView("south").prompts).toHaveLength(0);
    const cavendishId = engine.findCardInZone("south", "character", op01CavendishBoxTopper008);
    expect(
      engine.expectFailure({
        type: "declareAttack",
        seat: "south",
        attackerId: cavendishId,
        targetId: engine.leader("north"),
      }).reason,
    ).toBe("The selected attacker cannot attack.");
  });

  test("with two given DON!!, K.O.s only an opposing Character at 3000 power or less when attacking", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op02EdwardNewgate004, playedOnTurn: 0 }],
        activeDon: 2,
      },
      {
        character: [
          { card: eb01Doma005, rested: true },
          { card: eb01Fourtricks025, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const newgateId = engine.findCardInZone("south", "character", op02EdwardNewgate004);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", eb01Fourtricks025);

    engine.attachDon(newgateId, 2, "south");
    engine.declareAttack(newgateId, engine.leader("north"), "south");

    const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(ko?.kind).toBe("selectEntity");
    if (ko?.kind !== "selectEntity") throw new Error("Expected Edward.Newgate's K.O. target.");
    expect(ko.candidates.find((candidate) => candidate.ref.id === eligibleId)?.legal).toBe(true);
    expect(ko.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.some((card) => card?.instanceId === ineligibleId)).toBe(
      true,
    );
    expect(view.prompts).toHaveLength(0);
  });
});
