import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op04CharlotteBavarois106,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-106 Charlotte Bavarois", () => {
  test("trashes a chosen hand card to play the physical Life Trigger card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      {
        hand: [eb01Doma005, eb01Fourtricks025],
        life: [op04CharlotteBavarois106],
      },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bavaroisId = engine.findCardInZone("north", "life", op04CharlotteBavarois106);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");

    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Bavarois's hand-trash cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(discardId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(bavaroisId);
    expect(view.players.north.hand.map((card) => card.instanceId)).not.toContain(bavaroisId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! x1 gains +1000 only while its controller has fewer Life cards", () => {
    const fewerLife = OnePieceTestEngine.create(
      {
        character: [{ card: op04CharlotteBavarois106, attachedDon: 1 }],
        life: [eb01Doma005],
      },
      { life: [eb01Doma005, eb01Fourtricks025] },
    );
    const boostedId = fewerLife.findCardInZone("south", "character", op04CharlotteBavarois106);
    expect(
      fewerLife
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === boostedId)?.power,
    ).toBe(6000);

    const equalLife = OnePieceTestEngine.create(
      {
        character: [{ card: op04CharlotteBavarois106, attachedDon: 1 }],
        life: [eb01Doma005, eb01Fourtricks025],
      },
      { life: [eb01Doma005, eb01Fourtricks025] },
    );
    const unboostedId = equalLife.findCardInZone("south", "character", op04CharlotteBavarois106);
    expect(
      equalLife
        .getView("south")
        .players.south.characters.find((card) => card?.instanceId === unboostedId)?.power,
    ).toBe(5000);
  });

  test("may decline the Life Trigger cost without discarding or playing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [eb01Doma005], life: [op04CharlotteBavarois106] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const bavaroisId = engine.findCardInZone("north", "life", op04CharlotteBavarois106);
    const handId = engine.findCardInZone("north", "hand", eb01Doma005);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");

    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(bavaroisId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).not.toContain(bavaroisId);
    expect(view.prompts).toHaveLength(0);
  });
});
