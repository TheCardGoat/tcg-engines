import { describe, expect, test } from "vite-plus/test";
import {
  eb01MsMonday035,
  op09Adio023,
  op09Lim022,
  op09RobLucci038,
  op09Sabo027,
} from "@tcg/op-cards";

import { processEffectAction } from "../../../src/effects/actions.ts";
import { OnePieceTestEngine } from "../../../src/index.ts";
import { moveCard } from "../../../src/state.ts";

describe("OP09-022 Lim", () => {
  test("plays every Character rested and maps the paid ODYSSEY play boundary", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Lim022,
      hand: [op09RobLucci038, op09Sabo027, op09Adio023],
      activeDon: 7,
      donDeckCount: 1,
    });
    const directPlayId = engine.findCardInZone("south", "hand", op09RobLucci038);
    const effectPlayId = engine.findCardInZone("south", "hand", op09Sabo027);
    const excludedId = engine.findCardInZone("south", "hand", op09Adio023);

    engine.playCard(op09RobLucci038, "south");
    expect(
      engine
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === directPlayId)?.rested,
    ).toBe(true);

    engine.activateEffect(engine.leader("south"), "activateMain", "south");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");

    const addDon = engine.pendingDecision("effectAddDon", "south").steps[0];
    expect(addDon?.kind).toBe("chooseOption");
    engine.resolveDecision("effectAddDon", { optionId: "1" }, "south");

    const play = engine.pendingDecision("effectPlaySelection", "south").steps[0];
    expect(play?.kind).toBe("selectEntity");
    if (play?.kind !== "selectEntity") throw new Error("Expected Lim's ODYSSEY play choice.");
    expect(play.candidates.map((candidate) => candidate.ref.id)).toEqual([effectPlayId]);
    expect(play.candidates.map((candidate) => candidate.ref.id)).not.toContain(excludedId);
    engine.resolveDecision("effectPlaySelection", { selectedIds: [effectPlayId] }, "south");

    const view = engine.getView("south");
    expect(view.players.south).toMatchObject({ activeDon: 0, restedDon: 8, donDeckCount: 0 });
    expect(
      view.players.south.characters.find((card) => card?.instanceId === effectPlayId)?.rested,
    ).toBe(true);
    expect(view.prompts).toHaveLength(0);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });

  test("plays the resolving Trigger Character rested through playThisCard", () => {
    const engine = OnePieceTestEngine.create({
      leaderCardId: op09Lim022,
      hand: [eb01MsMonday035],
    });
    const state = engine.getState();
    const mondayId = engine.findCardInZone("south", "hand", eb01MsMonday035);
    moveCard(state, mondayId, "south", "resolution", {
      faceUp: true,
      publicKnowledge: true,
      actor: "south",
    });

    expect(
      processEffectAction(state, "south", mondayId, {
        action: "playThisCard",
      }),
    ).toBe(true);

    expect(engine.findCardInZone("south", "character", eb01MsMonday035)).toBe(mondayId);
    expect(
      engine.getView("south").players.south.characters.find((card) => card?.instanceId === mondayId)
        ?.rested,
    ).toBe(true);
    expect(engine.getState().capabilityHistory).toHaveLength(0);
  });
});
