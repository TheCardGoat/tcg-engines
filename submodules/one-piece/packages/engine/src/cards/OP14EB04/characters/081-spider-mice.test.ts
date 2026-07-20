import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Shanks120,
  op12UrsaShock096,
} from "@tcg/op-cards";
import { describe, expect, test } from "vite-plus/test";
import { op14eb04SpiderMice081 } from "../../../../../cards/src/cards/OP14EB04/characters/081-spider-mice.ts";
import { op14eb04Oinkchuck082 } from "../../../../../cards/src/cards/OP14EB04/characters/082-oinkchuck.ts";

import { OnePieceTestEngine } from "../../../index.ts";

describe("OP14-081 Spider Mice", () => {
  test("on play trashes the exact top three deck cards in order while leaving the remainder", () => {
    const engine = OnePieceTestEngine.create({
      hand: [op14eb04SpiderMice081],
      deck: [eb01Doma005, eb01Fourtricks025, eb01MountainGod018, op01Shanks120],
      activeDon: op14eb04SpiderMice081.cost,
    });
    const firstId = engine.findCardInZone("south", "deck", eb01Doma005);
    const secondId = engine.findCardInZone("south", "deck", eb01Fourtricks025);
    const thirdId = engine.findCardInZone("south", "deck", eb01MountainGod018);

    engine.playCard(op14eb04SpiderMice081, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toEqual([
      firstId,
      secondId,
      thirdId,
    ]);
    expect(view.players.south.deckCount).toBe(1);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. offers only an opposing printed base-cost-1 Character and K.O.s its physical identity", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04SpiderMice081] },
      {
        hand: [op12UrsaShock096],
        character: [eb01Doma005, op14eb04Oinkchuck082],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: op12UrsaShock096.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const spiderMiceId = engine.findCardInZone("south", "character", op14eb04SpiderMice081);
    const eligibleId = engine.findCardInZone("north", "character", eb01Doma005);
    const ineligibleId = engine.findCardInZone("north", "character", op14eb04Oinkchuck082);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [spiderMiceId] }, "north");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    if (target?.kind !== "selectEntity") throw new Error("Expected Spider Mice's K.O. target.");
    expect(target).toMatchObject({ min: 0, max: 1 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toContain(eligibleId);
    expect(target.candidates.map((candidate) => candidate.ref.id)).not.toContain(ineligibleId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [eligibleId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(spiderMiceId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(eligibleId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(ineligibleId);
    expect(view.prompts).toHaveLength(0);
  });

  test("on K.O. may choose no opposing base-cost-1 Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op14eb04SpiderMice081] },
      {
        hand: [op12UrsaShock096],
        character: [eb01Doma005],
        deck: [eb01Fourtricks025, eb01MountainGod018],
        activeDon: op12UrsaShock096.cost,
      },
      { firstPlayer: "south", activeSeat: "north" },
    );
    const spiderMiceId = engine.findCardInZone("south", "character", op14eb04SpiderMice081);
    const untouchedId = engine.findCardInZone("north", "character", eb01Doma005);

    engine.playCard(op12UrsaShock096, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [spiderMiceId] }, "north");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const view = engine.getView("south");
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(untouchedId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(untouchedId);
    expect(view.prompts).toHaveLength(0);
  });
});
