import { describe, expect, test } from "vite-plus/test";
import {
  eb01MontBlancCricket058,
  eb01MountainGod018,
  eb01Mr2BonKureiBentham061,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("EB01-061 Mr.2.Bon.Kurei (Bentham)", () => {
  test.each(["EB01-061", "OP01-084", "OP02-064", "OP04-069"])(
    "%s is excluded by the same-name restriction on OP14-091's On K.O. play",
    (cardId) => {
      const engine = OnePieceTestEngine.create(
        {
          hand: [cardId, "EB03-047"],
          character: [{ cardId: "OP14-091", rested: true }],
        },
        { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
        { activeSeat: "north" },
      );
      const targetId = engine.findCardInZone("south", "character", "OP14-091");
      const excludedId = engine.findCardInZone("south", "hand", cardId);
      const eligibleId = engine.findCardInZone("south", "hand", "EB03-047");
      engine.declareAttack(
        engine.findCardInZone("north", "character", eb01MountainGod018),
        targetId,
        "north",
      );
      engine.resolveDecision("battleCounter", { selectedIds: [] }, "south");
      const step = engine.pendingDecision("effectPlaySelection", "south").steps[0];
      if (step.kind !== "selectEntity") throw new Error("Expected On K.O. play selection.");
      expect(step.candidates.map((candidate) => candidate.ref.id)).toEqual([eligibleId]);
      engine.resolveDecision("effectPlaySelection", { selectedIds: [eligibleId] }, "south");
      expect(engine.getView("south").players.south.hand.map((card) => card.instanceId)).toContain(
        excludedId,
      );
      expect(
        engine
          .getView("south")
          .players.south.characters.some((card) => card?.instanceId === eligibleId),
      ).toBe(true);
    },
  );

  test("adds an active DON!! from the DON!! deck on play", () => {
    const engine = OnePieceTestEngine.create({
      hand: [eb01Mr2BonKureiBentham061],
      activeDon: 4,
      donDeckCount: 1,
    });

    engine.playCard(eb01Mr2BonKureiBentham061);
    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    if (addDon?.kind !== "chooseOption") {
      throw new Error("Expected Bentham's active DON!! count choice.");
    }
    expect(addDon.options.map((option) => option.id)).toEqual(["0", "1"]);
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    expect(engine.getView("south").players.south.activeDon).toBe(1);
    expect(engine.getView("south").players.south.donDeckCount).toBe(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("copies a selected opposing Character's current power as base power for the turn", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: eb01Mr2BonKureiBentham061, playedOnTurn: 0 }],
        activeDon: 1,
      },
      { character: [eb01MountainGod018, eb01MontBlancCricket058] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const benthamId = engine.findCardInZone("south", "character", eb01Mr2BonKureiBentham061);
    const copiedId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const otherId = engine.findCardInZone("north", "character", eb01MontBlancCricket058);

    engine.attachDon(benthamId, 1, "south");
    engine.declareAttack(benthamId, engine.leader("north"), "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") {
      throw new Error("Expected Bentham's opposing Character power-copy choice.");
    }
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([copiedId, otherId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [copiedId] }, "south");

    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === benthamId)?.power,
    ).toBe(8000);

    engine.endTurn("south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === benthamId)?.power,
    ).toBe(1000);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
  test("copies reduced current power instead of printed base power, then adds its own DON bonus", () => {
    const e = OnePieceTestEngine.create(
      { character: ["EB01-061"], hand: ["OP01-006"], activeDon: 2 },
      { character: ["EB01-025"] },
    );
    const source = e.findCardInZone("south", "character", "EB01-061"),
      target = e.findCardInZone("north", "character", "EB01-025");
    e.playCard("OP01-006");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(e.getView("south").players.north.characters[0]?.power).toBe(3000);
    e.attachDon(source, 1, "south");
    e.declareAttack(source, e.leader("north"), "south");
    e.resolveDecision("effectTargetSelection", { selectedIds: [target] }, "south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === source)?.power,
    ).toBe(4000);
    e.endTurn("south");
    expect(
      e.getView("south").players.south.characters.find((c) => c?.instanceId === source)?.power,
    ).toBe(1000);
    expect(e.getView("south").players.north.characters[0]?.power).toBe(5000);
  });
});
