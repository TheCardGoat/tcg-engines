import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  eb03Perona045,
  op06DrHogback090,
  op12Perona034,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB03-045 Perona", () => {
  test("blocks an attack", () => {
    const engine = OnePieceTestEngine.create(
      { character: [eb03Perona045] },
      { character: [{ card: eb01Doma005, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const peronaId = engine.findCardInZone("south", "character", eb03Perona045);
    const attackerId = engine.findCardInZone("north", "character", eb01Doma005);
    const lifeBefore = engine.getView("south").players.south.lifeCount;

    engine.declareAttack(attackerId, engine.leader("south"), "north");
    engine.resolveDecision("battleBlocker", { selectedIds: [peronaId] }, "south");

    expect(engine.getView("south").players.south.lifeCount).toBe(lifeBefore);
  });

  test("gives one rested DON!!, then plays only an eligible trash Character rested with ten cards in trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Perona045],
      character: [eb01Doma005],
      trash: [
        op12Perona034,
        op06DrHogback090,
        eb01MountainGod018,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
        eb01Doma005,
      ],
      activeDon: eb03Perona045.cost,
      restedDon: 1,
    });
    const recipientId = engine.findCardInZone("south", "character", eb01Doma005);
    const eligibleId = engine.findCardInZone("south", "trash", op12Perona034);
    const highCostId = engine.findCardInZone("south", "trash", op06DrHogback090);
    const wrongTraitId = engine.findCardInZone("south", "trash", eb01MountainGod018);

    engine.playCard(eb03Perona045, "south");
    const count = engine.pendingDecision("effectGiveDonCount", "south").steps[0];
    expect(count?.kind).toBe("chooseOption");
    if (count?.kind !== "chooseOption") throw new Error("Expected Perona's DON!! count choice.");
    expect(count.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectGiveDonCount", { optionId: "1" }, "south");

    const recipient = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(recipient?.kind).toBe("selectEntity");
    if (recipient?.kind !== "selectEntity") throw new Error("Expected Perona's DON!! recipient.");
    expect(recipient.candidates.map((candidate) => candidate.ref.id)).toContain(recipientId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [recipientId] }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Perona's trash play selection.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(highCostId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(wrongTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === recipientId)?.attachedDon,
    ).toBe(1);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === eligibleId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
  });

  test("does not play a trash Character below ten cards in trash", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb03Perona045],
      trash: Array.from({ length: 9 }, () => eb01Doma005),
      activeDon: eb03Perona045.cost,
    });

    engine.playCard(eb03Perona045, "south");
    engine.resolveDecision("effectGiveDonCount", { optionId: "0" }, "south");

    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(
      engine
        .getView("south")
        .players.south.characters.filter((card) => card?.cardId === eb03Perona045.id),
    ).toHaveLength(1);
  });
});
