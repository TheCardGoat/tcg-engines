import { describe, expect, test } from "vite-plus/test";
import { eb01Doma005, eb01MountainGod018, op07OutlookIii003 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP07-003 Outlook III", () => {
  test("may trash itself to reduce up to two opposing Characters for the turn", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op07OutlookIii003] },
      { character: [eb01Doma005, eb01MountainGod018] },
    );
    const sourceId = engine.findCardInZone("south", "character", op07OutlookIii003);
    const firstId = engine.findCardInZone("north", "character", eb01Doma005);
    const secondId = engine.findCardInZone("north", "character", eb01MountainGod018);
    const before = engine.getView("south").players.north.characters;
    const firstPower = before.find((card) => card?.instanceId === firstId)?.power;
    const secondPower = before.find((card) => card?.instanceId === secondId)?.power;
    if (firstPower == null || secondPower == null) {
      throw new Error("Expected both opposing Characters to have visible power.");
    }

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const target = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(target?.kind).toBe("selectEntity");
    if (target?.kind !== "selectEntity") throw new Error("Expected Outlook III's targets.");
    expect(target).toMatchObject({ min: 0, max: 2 });
    expect(target.candidates.map((candidate) => candidate.ref.id)).toEqual([firstId, secondId]);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [firstId, secondId] }, "south");

    let view = engine.getView("south");
    expect(view.players.south.trash.map((card) => card.instanceId)).toContain(sourceId);
    expect(view.players.north.characters.find((card) => card?.instanceId === firstId)?.power).toBe(
      firstPower - 2000,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === secondId)?.power).toBe(
      secondPower - 2000,
    );

    engine.endTurn("south");
    view = engine.getView("south");
    expect(view.players.north.characters.find((card) => card?.instanceId === firstId)?.power).toBe(
      firstPower,
    );
    expect(view.players.north.characters.find((card) => card?.instanceId === secondId)?.power).toBe(
      secondPower,
    );
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without trashing itself", () => {
    const engine = OnePieceTestEngine.create({ character: [op07OutlookIii003] });
    const sourceId = engine.findCardInZone("south", "character", op07OutlookIii003);

    engine.activateEffect(sourceId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(view.players.south.characters.some((card) => card?.instanceId === sourceId)).toBe(true);
    expect(view.players.south.trash.map((card) => card.instanceId)).not.toContain(sourceId);
    expect(view.prompts).toHaveLength(0);
  });
});
