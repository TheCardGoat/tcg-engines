import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op05BartholomewKuma011,
  op05EmporioIvankov004,
  op05Sabo007,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-004 Emporio.Ivankov", () => {
  test("plays only an inclusive Revolutionary Army candidate and is once per turn", () => {
    const engine = OnePieceTestEngine.create({
      hand: [
        op05EmporioIvankov004,
        op05EmporioIvankov004,
        op05BartholomewKuma011,
        op05Sabo007,
        eb01Doma005,
      ],
      activeDon: 6,
    });

    engine.playCard(op05EmporioIvankov004, "south");
    const sourceId = engine.findCardInZone("south", "character", op05EmporioIvankov004);
    const kumaId = engine.findCardInZone("south", "hand", op05BartholomewKuma011);
    const otherIvankovId = engine.findCardInZone("south", "hand", op05EmporioIvankov004);
    const saboId = engine.findCardInZone("south", "hand", op05Sabo007);
    const nonTraitId = engine.findCardInZone("south", "hand", eb01Doma005);
    engine.attachDon(sourceId, 2, "south");

    engine.activateEffect(sourceId, "activateMain", "south");
    const selection = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(selection?.kind).toBe("selectEntity");
    if (selection?.kind !== "selectEntity") throw new Error("Expected Ivankov's hand play.");
    expect(selection).toMatchObject({ min: 0, max: 1 });
    expect(selection.candidates.map((candidate) => candidate.ref.id)).toEqual([kumaId]);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(otherIvankovId);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(saboId);
    expect(selection.candidates.map((candidate) => candidate.ref.id)).not.toContain(nonTraitId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [kumaId] }, "south");

    expect(
      engine.getView("south").players.south.characters.some((card) => card?.instanceId === kumaId),
    ).toBe(true);
    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sourceId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });

  test("may decline the up-to-one hand play", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op05EmporioIvankov004, attachedDon: 2 }],
      hand: [op05BartholomewKuma011],
    });
    const sourceId = engine.findCardInZone("south", "character", op05EmporioIvankov004);
    const kumaId = engine.findCardInZone("south", "hand", op05BartholomewKuma011);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");

    expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
      kumaId,
    );
    expect(engine.getView("south").prompts).toHaveLength(0);
  });

  test("cannot activate below 7000 power", () => {
    const engine = OnePieceTestEngine.create({
      character: [{ card: op05EmporioIvankov004, playedOnTurn: 0 }],
      hand: [op05BartholomewKuma011],
    });
    const sourceId = engine.findCardInZone("south", "character", op05EmporioIvankov004);

    expect(
      engine.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: sourceId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
    expect(engine.getView("south").prompts).toHaveLength(0);
  });
});
