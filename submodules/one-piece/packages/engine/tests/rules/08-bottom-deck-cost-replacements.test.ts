import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("8-3-1-7: bottom-deck activation cost replacements", () => {
  test.each(["yes", "no"] as const)(
    "Plague Rounds waits for the opposing Zoro replacement: %s",
    (optionId) => {
      let engine = OnePieceTestEngine.create(
        { leaderCardId: "ST01-001", hand: ["OP04-055", "OP04-047"], activeDon: 2 },
        { leaderCardId: "ST01-001", character: ["ST01-006", "OP15-094"] },
      );
      const chopper = engine.findCardInZone("north", "character", "ST01-006");
      const zoro = engine.findCardInZone("north", "character", "OP15-094");
      const iceOni = engine.findCardInZone("south", "hand", "OP04-047");
      const deckBefore = engine.getView("north").players.north.deckCount;
      engine.playCard("OP04-055");
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      engine.resolveDecision(
        "effectCostReturnCharacterToDeck",
        { selectedIds: [chopper] },
        "south",
      );
      const prompt = engine.pendingDecision("effectRemovalReplacement", "north");
      expect(engine.getView("south").players.south.trash.map((card) => card.instanceId)).toContain(
        iceOni,
      );
      expect(engine.getView("south").players.south.characters.filter(Boolean)).toHaveLength(0);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      expect(engine.pendingDecision("effectRemovalReplacement", "north").id).toBe(prompt.id);
      engine.expectFailure({ type: "resolvePrompt", seat: "south", promptId: prompt.id, optionId });
      engine.expectFailure({
        type: "resolvePrompt",
        seat: "north",
        promptId: prompt.id,
        optionId: "invalid",
      });
      expect(engine.pendingDecision("effectRemovalReplacement", "north").id).toBe(prompt.id);
      engine.resolveDecision("effectRemovalReplacement", { optionId }, "north");
      const view = engine.getView("south");
      expect(view.players.north.characters.some((card) => card?.instanceId === chopper)).toBe(
        optionId === "yes",
      );
      expect(view.players.north.trash.some((card) => card.instanceId === zoro)).toBe(
        optionId === "yes",
      );
      expect(view.players.north.deckCount).toBe(deckBefore + (optionId === "no" ? 1 : 0));
      expect(view.players.south.characters.some((card) => card?.instanceId === iceOni)).toBe(
        optionId === "no",
      );
      expect(view.players.south.trash.some((card) => card.instanceId === iceOni)).toBe(
        optionId === "yes",
      );
      expect(view.players.south.activeDon).toBe(0);
      expect(view.prompts).toHaveLength(0);
      expect(engine.getState().capabilityHistory).toHaveLength(0);
    },
  );
});
