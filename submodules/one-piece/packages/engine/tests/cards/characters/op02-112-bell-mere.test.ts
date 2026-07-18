import { describe, expect, test } from "vite-plus/test";
import { op02BellMere112, op02Minokoala086, op02Tashigi105 } from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP02-112 Bell-mere", () => {
  test("may rest itself to reduce an opposing Character's cost, then give an own Character +1000", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02BellMere112, op02Tashigi105] },
      { character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bellMereId = engine.findCardInZone("south", "character", op02BellMere112);
    const ownTargetId = engine.findCardInZone("south", "character", op02Tashigi105);
    const opposingTargetId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.activateEffect(bellMereId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [opposingTargetId] }, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownTargetId] }, "south");

    let view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bellMereId)?.rested,
    ).toBe(true);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingTargetId)?.cost,
    ).toBe(3);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownTargetId)?.power,
    ).toBe(6000);

    engine.endTurn("south");
    view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingTargetId)?.cost,
    ).toBe(4);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownTargetId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });

  test("may decline without resting itself or changing either target", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02BellMere112, op02Tashigi105] },
      { character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bellMereId = engine.findCardInZone("south", "character", op02BellMere112);
    const ownTargetId = engine.findCardInZone("south", "character", op02Tashigi105);
    const opposingTargetId = engine.findCardInZone("north", "character", op02Minokoala086);

    engine.activateEffect(bellMereId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "south");

    const view = engine.getView("south");
    expect(
      view.players.south.characters.find((card) => card?.instanceId === bellMereId)?.rested,
    ).toBe(false);
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingTargetId)?.cost,
    ).toBe(4);
    expect(
      view.players.south.characters.find((card) => card?.instanceId === ownTargetId)?.power,
    ).toBe(5000);
    expect(view.prompts).toHaveLength(0);
  });

  test("may skip the opposing target, then buff only its controller's Leader or Character", () => {
    const engine = OnePieceTestEngine.create(
      { character: [op02BellMere112, op02Tashigi105] },
      { character: [op02Minokoala086] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const bellMereId = engine.findCardInZone("south", "character", op02BellMere112);
    const ownCharacterId = engine.findCardInZone("south", "character", op02Tashigi105);
    const opposingCharacterId = engine.findCardInZone("north", "character", op02Minokoala086);
    const ownLeaderId = engine.leader("south");
    const leaderPowerBefore = engine.getView("south").players.south.leader.power;
    if (leaderPowerBefore === null) throw new Error("Expected the Leader to have power.");

    engine.activateEffect(bellMereId, "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const costTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(costTarget?.kind).toBe("selectEntity");
    if (costTarget?.kind !== "selectEntity") {
      throw new Error("Expected Bell-mere's opposing cost target.");
    }
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).toContain(
      opposingCharacterId,
    );
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      ownCharacterId,
    );
    expect(costTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(bellMereId);
    engine.resolveDecision("effectTargetSelection", { selectedIds: [] }, "south");

    const powerTarget = engine.pendingDecision("effectTargetSelection", "south").steps[0];
    expect(powerTarget?.kind).toBe("selectEntity");
    if (powerTarget?.kind !== "selectEntity") {
      throw new Error("Expected Bell-mere's own power target.");
    }
    expect(powerTarget.candidates.map((candidate) => candidate.ref.id)).toContain(ownLeaderId);
    expect(powerTarget.candidates.map((candidate) => candidate.ref.id)).toContain(ownCharacterId);
    expect(powerTarget.candidates.map((candidate) => candidate.ref.id)).not.toContain(
      opposingCharacterId,
    );
    engine.resolveDecision("effectTargetSelection", { selectedIds: [ownLeaderId] }, "south");

    const view = engine.getView("south");
    expect(
      view.players.north.characters.find((card) => card?.instanceId === opposingCharacterId)?.cost,
    ).toBe(4);
    expect(view.players.south.leader.power).toBe(leaderPowerBefore + 1000);
    expect(view.prompts).toHaveLength(0);
  });
});
