import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  op05Buffalo031,
  op05Maynard052,
  op05Stainless045,
} from "@tcg/op-cards";

import { getLegalCommands, OnePieceTestEngine } from "../../../src/index.ts";

describe("OP05-045 Stainless", () => {
  test("trashes a chosen hand card and rests itself before targeting either field", () => {
    const engine = OnePieceTestEngine.create(
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        character: [op05Stainless045, eb01Doma005],
      },
      { character: [op05Maynard052, op05Buffalo031] },
    );
    const stainlessId = engine.findCardInZone("south", "character", op05Stainless045);
    const ownId = engine.findCardInZone("south", "character", eb01Doma005);
    const opposingId = engine.findCardInZone("north", "character", op05Maynard052);
    const expensiveId = engine.findCardInZone("north", "character", op05Buffalo031);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.activateEffect(stainlessId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "south").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Stainless's discard cost.");
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Stainless's Character target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([ownId, opposingId]);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(expensiveId);
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === stainlessId)?.rested,
    ).toBe(true);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingId] }, "south");

    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardId,
    );
    expect(engine.getState().players.north.deck.at(-1)).toBe(opposingId);
    expect(engine.getView("south").prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("may target nothing after paying, while an empty hand blocks activation", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01Doma005],
      character: [op05Stainless045],
    });
    const stainlessId = engine.findCardInZone("south", "character", op05Stainless045);
    const discardId = engine.findCardInZone("south", "hand", eb01Doma005);

    engine.activateEffect(stainlessId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
      discardId,
    );
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === stainlessId)?.rested,
    ).toBe(true);

    const blocked = OnePieceTestEngine.create({ character: [op05Stainless045] });
    const blockedId = blocked.findCardInZone("south", "character", op05Stainless045);
    expect(
      getLegalCommands(blocked.getState(), "south").some(
        (command) => command.type === "activateEffect" && command.sourceId === blockedId,
      ),
    ).toBe(false);
  });

  test("may decline without paying and cannot activate while rested", () => {
    const declined = OnePieceTestEngine.create({
      character: [op05Stainless045],
      hand: [eb01Fourtricks025],
    });
    const stainlessId = declined.findCardInZone("south", "character", op05Stainless045);
    const keptId = declined.findCardInZone("south", "hand", eb01Fourtricks025);
    declined.activateEffect(stainlessId, "activateMain", "south");
    declined.resolveDecision("effectOptional", { optionId: "no" }, "south");

    let view = declined.getView("south");
    expect(view.players.south.hand.map((card) => card.instanceId)).toContain(keptId);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === stainlessId)?.rested,
    ).toBe(false);

    const rested = OnePieceTestEngine.create({
      character: [{ card: op05Stainless045, rested: true }],
      hand: [eb01Fourtricks025],
    });
    const restedId = rested.findCardInZone("south", "character", op05Stainless045);
    expect(
      rested.expectFailure({
        type: "activateEffect",
        seat: "south",
        sourceInstanceId: restedId,
        trigger: "activateMain",
      }).accepted,
    ).toBe(false);
  });
});
