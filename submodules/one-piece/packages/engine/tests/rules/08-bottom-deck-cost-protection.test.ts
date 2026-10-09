import { describe, expect, test } from "vite-plus/test";
import { OnePieceTestEngine } from "../../src/index.ts";

describe("8-3-1-3: prohibited removal cannot pay a bottom-deck cost", () => {
  test.each(["OP04-055", "OP06-043"])(
    "%s cannot pay with only protected opposing Characters",
    (source) => {
      let engine = OnePieceTestEngine.create(
        {
          leaderCardId: "OP14-079",
          hand: source === "OP04-055" ? [source, "OP04-047"] : ["OP04-047"],
          character: source === "OP06-043" ? [source] : [],
          activeDon: 2,
        },
        { character: ["ST01-006"] },
      );
      const payment = engine.findCardInZone("south", "hand", "OP04-047");
      const protectedId = engine.findCardInZone("north", "character", "ST01-006");
      if (source === "OP04-055") engine.playCard(source);
      else {
        const failed = engine.expectFailure({
          type: "activateEffect",
          seat: "south",
          sourceInstanceId: engine.findCardInZone("south", "character", source),
          trigger: "activateMain",
        });
        engine = OnePieceTestEngine.fromState(failed.state);
      }
      const view = engine.getView("south");
      expect(view.prompts).toHaveLength(0);
      expect(view.players.south.hand.map((c) => c.instanceId)).toContain(payment);
      expect(view.players.north.characters.map((c) => c?.instanceId)).toContain(protectedId);
      expect(view.players.south.characters.some((c) => c?.instanceId === payment)).toBe(false);
      if (source === "OP06-043")
        expect(view.players.south.characters.find((c) => c?.cardId === source)?.power).toBe(8000);
    },
  );

  test.each(["OP04-055", "OP06-043"])(
    "%s offers only payable cards and rejects a protected ID without further payment",
    (source) => {
      let engine = OnePieceTestEngine.create(
        {
          leaderCardId: "OP14-079",
          hand: source === "OP04-055" ? [source, "OP04-047"] : ["OP04-047"],
          character:
            source === "OP06-043" ? [source, "ST01-006", "ST01-006"] : ["ST01-006", "ST01-006"],
          activeDon: 2,
        },
        { character: ["ST01-006"] },
      );
      const payment = engine.findCardInZone("south", "hand", "OP04-047");
      const ownId = engine.findCardInZone("south", "character", "ST01-006");
      const protectedId = engine.findCardInZone("north", "character", "ST01-006");
      const sourceId =
        source === "OP06-043" ? engine.findCardInZone("south", "character", source) : undefined;
      if (sourceId) engine.activateEffect(sourceId, "activateMain", "south");
      else engine.playCard(source);
      engine.resolveDecision("effectOptional", { optionId: "yes" }, "south");
      const prompt = engine.pendingDecision("effectCostReturnCharacterToDeck", "south");
      expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
        payment,
      );
      const step = prompt.steps[0];
      if (step?.kind !== "payCost") throw new Error("Expected bottom-deck payment choice");
      expect(step.candidates.map((c) => c.ref.id)).not.toContain(protectedId);
      expect(step.candidates.map((c) => c.ref.id)).toContain(ownId);
      engine = OnePieceTestEngine.fromState(JSON.parse(JSON.stringify(engine.getState())));
      for (const selectedIds of [[], [protectedId], [ownId, protectedId], [ownId, ownId]]) {
        const beforeInvalid = engine.getView("south");
        const failed = engine.expectFailure({
          type: "resolvePrompt",
          seat: "south",
          promptId: prompt.id,
          selectedIds,
        });
        engine = OnePieceTestEngine.fromState(failed.state);
        const rejected = engine.getView("south");
        expect(rejected.logs).toHaveLength(beforeInvalid.logs.length + 1);
        expect(rejected.logs.at(-1)?.message).toBe("Prompt resolution could not be applied.");
        expect({ ...rejected, logs: rejected.logs.slice(0, -1) }).toEqual(beforeInvalid);
        expect(engine.pendingDecision("effectCostReturnCharacterToDeck", "south")).toEqual(prompt);
        expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
          payment,
        );
        expect(
          engine.getView("south").players.south.characters.map((c) => c?.instanceId),
        ).toContain(ownId);
        if (sourceId)
          expect(
            engine.getView("south").players.south.characters.find((c) => c?.instanceId === sourceId)
              ?.power,
          ).toBe(8000);
      }
      expect(engine.pendingDecision("effectCostReturnCharacterToDeck", "south").id).toBe(prompt.id);
      expect(engine.getView("south").players.south.trash.map((c) => c.instanceId)).toContain(
        payment,
      );
      engine.resolveDecision("effectCostReturnCharacterToDeck", { selectedIds: [ownId] }, "south");
      const view = engine.getView("south");
      expect(view.players.north.characters.map((c) => c?.instanceId)).toContain(protectedId);
      expect(view.players.south.characters.map((c) => c?.instanceId)).not.toContain(ownId);
      expect(view.players.south.hand.map((c) => c.instanceId)).not.toContain(payment);
      if (sourceId)
        expect(view.players.south.characters.find((c) => c?.instanceId === sourceId)?.power).toBe(
          11000,
        );
      else expect(view.players.south.characters.map((c) => c?.instanceId)).toContain(payment);
      expect(view.prompts).toHaveLength(0);
    },
  );
});
