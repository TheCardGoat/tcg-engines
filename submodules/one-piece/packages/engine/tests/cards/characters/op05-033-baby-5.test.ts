import { describe, expect, test } from "vite-plus/test";
import type { CharacterCard } from "@tcg/op-types";
import { eb01Doma005, op04DonquixoteFamily036, op05Baby5033, op05Buffalo031 } from "@tcg/op-cards";

import { registerCards } from "../../../../cards/src/runtime-catalog.ts";
import { getLegalCommands, OnePieceTestEngine } from "../../../src/index.ts";

const compoundDonquixoteCharacter: CharacterCard = {
  ...eb01Doma005,
  id: "TEST-OP05-033-COMPOUND-DONQUIXOTE",
  canonicalId: "TEST-OP05-033-COMPOUND-DONQUIXOTE",
  name: "Compound Donquixote Character",
  cost: 2,
  traits: ["Test Fleet/Donquixote Pirates"],
};

registerCards([compoundDonquixoteCharacter]);

describe("OP05-033 Baby 5", () => {
  test("rests one DON!! and itself before playing an included Donquixote Character costing 2", () => {
    const engine = OnePieceTestEngine.create({
      hand: [compoundDonquixoteCharacter, op05Buffalo031, op04DonquixoteFamily036],
      character: [op05Baby5033],
      activeDon: 1,
    });
    const babyId = engine.findCardInZone("south", "character", op05Baby5033);
    const eligibleId = engine.findCardInZone("south", "hand", compoundDonquixoteCharacter);
    const expensiveId = engine.findCardInZone("south", "hand", op05Buffalo031);
    const eventId = engine.findCardInZone("south", "hand", op04DonquixoteFamily036);

    engine.activateEffect(babyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Baby 5's play choice.");
    expect(play).toMatchObject({ min: 0, max: 1 });
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(eventId);

    const paidView = engine.getView("south");
    expect(paidView.players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      paidView.players.south.characters.find((card) => card?.instanceId === babyId)?.rested,
    ).toBe(true);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.map((card) => card?.instanceId)).toContain(eligibleId);
    expect(view.players.south.hand.map((card) => card.instanceId)).not.toContain(eligibleId);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may play nothing after paying, while no active DON!! makes activation illegal", () => {
    const engine = OnePieceTestEngine.create({
      hand: [compoundDonquixoteCharacter],
      character: [op05Baby5033],
      activeDon: 1,
    });
    const babyId = engine.findCardInZone("south", "character", op05Baby5033);

    engine.activateEffect(babyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectPlaySelection", { selectedIds: [] }, "south");
    expect(engine.getView("south").players.south).toMatchObject({ activeDon: 0, restedDon: 1 });
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === babyId)
        ?.rested,
    ).toBe(true);

    const blocked = OnePieceTestEngine.create({ character: [op05Baby5033] });
    const blockedId = blocked.findCardInZone("south", "character", op05Baby5033);
    expect(
      getLegalCommands(blocked.getState(), "south").some(
        (command) => command.type === "activateEffect" && command.sourceId === blockedId,
      ),
    ).toBe(false);
  });

  test("may decline without resting itself or DON!!", () => {
    const engine = OnePieceTestEngine.create({
      character: [op05Baby5033],
      hand: [compoundDonquixoteCharacter],
      activeDon: 1,
    });
    const babyId = engine.findCardInZone("south", "character", op05Baby5033);

    engine.activateEffect(babyId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.find((card) => card?.instanceId === babyId)?.rested).toBe(
      false,
    );
    expect(view.players.south).toMatchObject({ activeDon: 1, restedDon: 0 });
    expect(view.players.south.hand).toHaveLength(1);
  });
});
