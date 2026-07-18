import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01MountainGod018,
  op05Gedatsu102,
  op07MonkeyDDragon015,
  op08Pedro030,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

function koPedro(engine: OnePieceTestEngine) {
  engine.playCard(op05Gedatsu102, "south");
  const ko = engine.pendingDecision("effectTargetSelection", "south").steps[0];
  expect(ko).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
  if (ko?.kind !== "selectEntity") throw new Error("Expected Gedatsu's K.O. target.");
  const pedroId = engine.findCardInZone("north", "character", op08Pedro030);
  expect(ko.candidates.map((candidate) => candidate.ref.id)).toContain(pedroId);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [pedroId] }, "south");
}

describe("OP08-030 Pedro", () => {
  test("can block an attack and become its new target", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01MountainGod018, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [op08Pedro030] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const pedroId = engine.findCardInZone("north", "character", op08Pedro030);

    engine.declareAttack(attackerId, engine.leader("north"), "south");

    const blocker = engine.pendingDecision("battleBlocker", "north").steps[0];
    expect(blocker?.kind).toBe("selectEntity");
    if (blocker?.kind !== "selectEntity") throw new Error("Expected Pedro's Blocker choice.");
    expect(blocker.candidates.map((candidate) => candidate.ref.id)).toContain(pedroId);
    engine.resolveDecision("battleBlocker", { selectedIds: [pedroId] }, "north");

    const choice = engine.pendingDecision("effectActionChoice", "north").steps[0];
    expect(choice).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
    const donCount = engine.pendingDecision("effectRestDonCount", "north").steps[0];
    expect(donCount).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "north");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      pedroId,
    );
  });

  test("on K.O. can rest up to one opponent DON!! card", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op05Gedatsu102], activeDon: op05Gedatsu102.cost + 1 },
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [op08Pedro030],
      },
    );

    koPedro(engine);

    const choice = engine.pendingDecision("effectActionChoice", "north").steps[0];
    expect(choice?.kind).toBe("chooseOption");
    if (choice?.kind !== "chooseOption") throw new Error("Expected Pedro's printed choice.");
    expect(choice.options.map((option) => option.label)).toEqual(["rest", "ko"]);
    engine.resolveDecision("effectActionChoice", { optionId: "0" }, "north");
    const donCount = engine.pendingDecision("effectRestDonCount", "north").steps[0];
    expect(donCount).toMatchObject({ kind: "chooseOption" });
    engine.resolveDecision("effectRestDonCount", { optionId: "1" }, "north");

    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 6 });
  });

  test("on K.O. can K.O. only an opponent rested cost-6-or-less Character", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [op05Gedatsu102],
        activeDon: op05Gedatsu102.cost,
        character: [
          { card: eb01Doma005, rested: true },
          { card: op07MonkeyDDragon015, rested: true },
        ],
      },
      {
        life: [eb01Doma005, eb01Doma005, eb01Doma005, eb01Doma005],
        character: [op08Pedro030],
      },
    );
    const eligibleId = engine.findCardInZone("south", "character", eb01Doma005);
    const expensiveId = engine.findCardInZone("south", "character", op07MonkeyDDragon015);

    koPedro(engine);
    engine.resolveDecision("effectActionChoice", { optionId: "1" }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected Pedro's Character choice.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(expensiveId);
  });
});
