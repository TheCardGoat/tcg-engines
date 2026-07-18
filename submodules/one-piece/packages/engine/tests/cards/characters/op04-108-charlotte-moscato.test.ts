import { describe, expect, test } from "vite-plus/test";
import {
  eb01Doma005,
  eb01Fourtricks025,
  eb01MountainGod018,
  op01Kawamatsu037,
  op04CharlotteMoscato108,
  op06GumGumKingKongGatling018,
} from "@tcg/op-cards";

import { OnePieceTestEngine } from "../../../src/index.ts";

describe("OP04-108 Charlotte Moscato", () => {
  test("trashes a chosen hand card to play the physical Life Trigger card", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [eb01Doma005, eb01Fourtricks025], life: [op04CharlotteMoscato108] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const discardId = engine.findCardInZone("north", "hand", eb01Doma005);
    const moscatoId = engine.findCardInZone("north", "life", op04CharlotteMoscato108);

    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "yes" }, "north");
    const cost = engine.pendingDecision("effectCostTrashFromHand", "north").steps[0];
    expect(cost?.kind).toBe("payCost");
    if (cost?.kind !== "payCost") throw new Error("Expected Moscato's hand cost.");
    expect(cost.candidates.map((candidate) => candidate.ref.id)).toContain(discardId);
    engine.resolveDecision("effectCostTrashFromHand", { selectedIds: [discardId] }, "north");

    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(discardId);
    expect(view.players.north.characters.map((card) => card?.instanceId)).toContain(moscatoId);
    expect(view.players.north.trash.map((card) => card.instanceId)).not.toContain(moscatoId);
    expect(view.prompts).toHaveLength(0);
  });

  test("with DON!! x1 Banish trashes damaged Life without offering its Trigger", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: op04CharlotteMoscato108, attachedDon: 1, playedOnTurn: 0 }] },
      { life: [op01Kawamatsu037] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sourceId = engine.findCardInZone("south", "character", op04CharlotteMoscato108);
    const lifeId = engine.findCardInZone("north", "life", op01Kawamatsu037);
    engine.declareAttack(sourceId, engine.leader("north"), "south");
    const view = engine.getView("north");
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(lifeId);
    expect(view.decisions).toHaveLength(0);
  });

  test("without attached DON!! damage still offers the Life card's Trigger", () => {
    const engine = OnePieceTestEngine.create(
      {
        character: [{ card: op04CharlotteMoscato108, playedOnTurn: 0 }],
        hand: [op06GumGumKingKongGatling018],
        activeDon: op06GumGumKingKongGatling018.cost,
      },
      { life: [op01Kawamatsu037] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const sourceId = engine.findCardInZone("south", "character", op04CharlotteMoscato108);
    engine.playCard(op06GumGumKingKongGatling018, "south");
    engine.resolveDecision("effectTargetSelection", { selectedIds: [sourceId] }, "south");
    engine.declareAttack(sourceId, engine.leader("north"), "south");
    expect(engine.pendingDecision("lifeTrigger", "north").steps[0]?.kind).toBe("confirm");
  });

  test("may decline the Life Trigger cost without discarding or playing", () => {
    const engine = OnePieceTestEngine.create(
      { character: [{ card: eb01MountainGod018, playedOnTurn: 0 }] },
      { hand: [eb01Doma005], life: [op04CharlotteMoscato108] },
      { firstPlayer: "north", activeSeat: "south" },
    );
    const attackerId = engine.findCardInZone("south", "character", eb01MountainGod018);
    const moscatoId = engine.findCardInZone("north", "life", op04CharlotteMoscato108);
    const handId = engine.findCardInZone("north", "hand", eb01Doma005);
    engine.declareAttack(attackerId, engine.leader("north"), "south");
    engine.resolveDecision("battleCounter", { selectedIds: [] }, "north");
    engine.resolveDecision("lifeTrigger", { optionId: "activate" }, "north");
    engine.resolveDecision("effectOptional", { optionId: "no" }, "north");
    const view = engine.getView("north");
    expect(view.players.north.hand.map((card) => card.instanceId)).toContain(handId);
    expect(view.players.north.trash.map((card) => card.instanceId)).toContain(moscatoId);
  });
});
