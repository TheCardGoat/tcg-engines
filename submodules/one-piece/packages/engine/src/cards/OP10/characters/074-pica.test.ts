import { describe, expect, test } from "vite-plus/test";
import { eb01MountainGod018, op01XDrake054, op10Pica074 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../index.ts";

function koPicaWithDrake(engine: OnePieceTestEngine, picaId: string) {
  engine.playCard(op01XDrake054, "north");
  const target = engine.pendingDecision("effectTargetSelection", "north").steps[0];
  if (target?.kind !== "selectEntity") throw new Error("Expected X.Drake's K.O. target.");
  expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(picaId);
  engine.resolveDecision("effectTargetSelection", { selectedIds: [picaId] }, "north");
}

describe("OP10-074 Pica", () => {
  test("rests two active DON!! instead of the first opponent-effect K.O. only once per turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Pica074, rested: true }], activeDon: 4 },
      { hand: [op01XDrake054, op01XDrake054], activeDon: 10 },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const picaId = engine.findCardInZone("south", "character", op10Pica074);

    koPicaWithDrake(engine, picaId);
    engine.resolveDecision("effectKoReplacement", { optionId: "yes" }, "south");
    const payment = engine.pendingDecision("effectRestDonCount", "south").steps[0];
    if (payment?.kind !== "chooseOption") {
      throw new Error("Expected Pica's exact two-DON!! replacement payment.");
    }
    expect(payment.options.map((option) => option.id)).toEqual(["2"]);
    engine.resolveDecision("effectRestDonCount", { optionId: "2" }, "south");

    let view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(picaId);
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 2 });

    koPicaWithDrake(engine, picaId);

    view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(picaId);
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 2 });
    expect(view.prompts).toHaveLength(0);
  });

  test("does not replace a battle K.O.", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op10Pica074, rested: true }], activeDon: 2 },
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const picaId = engine.findCardInZone("south", "character", op10Pica074);
    const attackerId = engine.findCardInZone("north", "character", eb01MountainGod018);

    engine.declareAttack(attackerId, picaId, "north");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(picaId);
    expect(view.players.south).toMatchObject({ activeDon: 2, restedDon: 0 });
    expect(view.prompts).toHaveLength(0);
  });
});
