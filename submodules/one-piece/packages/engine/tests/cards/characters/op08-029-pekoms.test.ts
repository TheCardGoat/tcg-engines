import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  op01Nekomamushi048,
  op01XDrake054,
  op08Pekoms029,
  op13GumGumDawnStamp117,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP08-029 Pekoms", () => {
  test("while active protects other included Minks costing 3 or less", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01XDrake054], activeDon: 5 },
      {
        character: [
          { card: op08Pekoms029, rested: false },
          { card: op01Nekomamushi048, rested: true },
          { card: eb01Doma005, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pekomsId = engine.findCardInZone("north", "character", op08Pekoms029);
    const protectedId = engine.findCardInZone("north", "character", op01Nekomamushi048);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op01XDrake054, "south");
    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target).toMatchObject({ kind: "selectEntity", min: 0, max: 1 });
    if (target?.kind !== "selectEntity") throw new Error("Expected X.Drake's K.O. target.");
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(protectedId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(protectedId);
    expect(
      engine.getView("north").players.north.characters.map((card) => card?.instanceId),
    ).toContain(pekomsId);
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      eligibleId,
    );
  });

  test("does not protect Pekoms itself while active", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op13GumGumDawnStamp117], life: [eb01Doma005], activeDon: 5 },
      { character: [op08Pekoms029] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const pekomsId = engine.findCardInZone("north", "character", op08Pekoms029);
    engine.playCard(op13GumGumDawnStamp117, "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [pekomsId] }, "south");
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      pekomsId,
    );
  });

  test("stops protecting when Pekoms is rested", () => {
    const engine = OnePieceTestEngine.create(
      { hand: [op01XDrake054], activeDon: 5 },
      {
        character: [
          { card: op08Pekoms029, rested: true },
          { card: op01Nekomamushi048, rested: true },
        ],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const targetId = engine.findCardInZone("north", "character", op01Nekomamushi048);
    engine.playCard(op01XDrake054, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [targetId] }, "south");
    expect(engine.getView("north").players.north.trash.map((card) => card.instanceId)).toContain(
      targetId,
    );
  });
});
