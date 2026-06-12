import { describe, expect, it } from "vite-plus/test";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectCardPlayable,
  expectPendingChoice,
  expectEligibleTargetCount,
  expectTargetChoice,
  expectEligibleGigs,
} from "@cyberpunk-engine/testing/index.ts";
import { spoilerPeaceOffering } from "@tcg/cyberpunk-cards";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";
import type { CommandResult } from "@cyberpunk-engine/types/commands.ts";

const peaceOffering = spoilerPeaceOffering; // program, cost 1

function formattedMoveLogs(result: CommandResult): string[] {
  if (!result.success) return [];
  return result.moveLogs
    .filter((log) => log.type === "action")
    .map((log) =>
      formatActionLog(
        {
          type: "actionLog",
          messageKey: log.messageKey,
          params: log.params,
          playerId: log.playerId,
        },
        enMessages,
      ),
    );
}

describe("Peace Offering", () => {
  describe("UI prompt", () => {
    it("shows the program as playable", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        hand: [peaceOffering],
        eddies: peaceOffering.cost,
      });
      expectCardPlayable(engine, peaceOffering);
    });

    it("presents two friendly gigs as targets after playing", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [peaceOffering],
          eddies: peaceOffering.cost,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {},
      );
      engine.playCard(peaceOffering);
      expectPendingChoice(engine, "chooseTarget");
      expectTargetChoice(engine, { type: "effectTarget", targetKind: "gig", min: 2, max: 2 });
      expectEligibleTargetCount(engine, 2);
      expectEligibleGigs(engine, [{ dieType: "d4" }, { dieType: "d6" }]);
    });
  });

  describe("printed stats", () => {
    it("has the printed cost, color, classifications, and type", () => {
      expect(peaceOffering.type).toBe("program");
      expect(peaceOffering.cost).toBe(1);
      expect(peaceOffering.color).toBe("green");
      expect(peaceOffering.classifications).toEqual(["Braindance"]);
    });
  });

  describe("ability shape", () => {
    it("triggers on PLAY", () => {
      expect(peaceOffering.timingTriggers).toContain("play");
      const ability = peaceOffering.abilities[0]!;
      expect(ability.kind).toBe("triggered");
      expect(ability.trigger?.trigger).toBe("play");
    });

    it("binds one ordered two-gig choice", () => {
      const ability = peaceOffering.abilities[0]!;
      const bindings = ability.bindings ?? [];
      expect(bindings).toHaveLength(1);
      expect(bindings[0]!.id).toBe("selectedGigs");
      expect(bindings[0]!.target).toMatchObject({
        selector: "gig",
        amount: 2,
        selection: { mode: "choose", min: 2, max: 2 },
      });
      expect(bindings[0]!.target).not.toHaveProperty("controller");
    });

    it("uses copyGigValue with the first selected Gig as source and second as target", () => {
      const ability = peaceOffering.abilities[0]!;
      const copy = ability.effects[0]!;
      expect(copy.effect).toBe("copyGigValue");
      if (copy.effect !== "copyGigValue") return; // type narrowing
      expect(copy.source).toEqual({ selector: "bound", id: "selectedGigs", index: 0 });
      expect(copy.target).toEqual({ selector: "bound", id: "selectedGigs", index: 1 });
      expect(copy.optional).toBe(true);
    });

    it("draws 1 conditioned on having a value-pair", () => {
      const ability = peaceOffering.abilities[0]!;
      const draw = ability.effects[1]!;
      expect(draw.effect).toBe("draw");
      if (draw.effect !== "draw") return;
      expect(draw.amount).toBe(1);
      expect(draw.conditions).toEqual([{ condition: "hasGigPair", controller: "friendly" }]);
    });
  });

  describe("play behavior", () => {
    it("moves the program to trash after play", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [peaceOffering],
          eddies: peaceOffering.cost,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {},
      );

      engine.playCard(peaceOffering);

      expect(engine.getCard(peaceOffering, "trash", P1).definitionId).toBe(peaceOffering.id);
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseTarget");
      if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
        throw new Error("Expected Peace Offering target choice");
      }
      expect(choice.payload.min).toBe(2);
      expect(choice.payload.max).toBe(2);
    });

    it("sets the second selected Gig to the first selected Gig's value and then draws for a value-pair", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [peaceOffering],
          eddies: peaceOffering.cost,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 5 },
          ],
        },
        {},
      );

      engine.playCard(peaceOffering);
      const sourceGigId = engine.findGigIdByType(P1, "d4");
      const targetGigId = engine.findGigIdByType(P1, "d6");
      const result = engine.getLocalEngine().processCommand(
        {
          commandID: "resolve-peace-offering",
          move: "resolveEffectTarget",
          input: { args: { targetIds: [sourceGigId, targetGigId] } },
        },
        P1,
      );

      expect(result.success).toBe(true);
      expect(engine.getState().G.gigDice[targetGigId]!.faceValue).toBe(2);
      expect(engine.getHandCount(P1)).toBe(1);
    });

    it("logs the actual copied Gig value instead of only the selected dice", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [peaceOffering],
          eddies: peaceOffering.cost,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d6", faceValue: 4 },
          ],
        },
        {},
      );

      engine.playCard(peaceOffering);
      const sourceGigId = engine.findGigIdByType(P1, "d6");
      const targetGigId = engine.findGigIdByType(P1, "d4");
      const result = engine.getLocalEngine().processCommand(
        {
          commandID: "resolve-peace-offering-log",
          move: "resolveEffectTarget",
          input: { args: { targetIds: [sourceGigId, targetGigId] } },
        },
        P1,
      );

      expect(result.success).toBe(true);
      const logs = formattedMoveLogs(result);
      expect(logs).toContain("Peace Offering copied D6's 4 to D4 (2 -> 4).");
      expect(logs).not.toContain("Selected D6, D4 for Peace Offering.");
    });

    it("logs when the source value is too high for the target die face", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [peaceOffering],
          eddies: peaceOffering.cost,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d8", faceValue: 8 },
          ],
        },
        {},
      );

      engine.playCard(peaceOffering);
      const sourceGigId = engine.findGigIdByType(P1, "d8");
      const targetGigId = engine.findGigIdByType(P1, "d4");
      const result = engine.getLocalEngine().processCommand(
        {
          commandID: "resolve-peace-offering-capped-log",
          move: "resolveEffectTarget",
          input: { args: { targetIds: [sourceGigId, targetGigId] } },
        },
        P1,
      );

      expect(result.success).toBe(true);
      expect(engine.getState().G.gigDice[targetGigId]!.faceValue).toBe(4);
      const logs = formattedMoveLogs(result);
      expect(logs).toContain(
        "Peace Offering could not copy D8's 8 to D4; D4 can show at most 4, so it became 4.",
      );
      expect(logs).not.toContain("Selected D8, D4 for Peace Offering.");
    });

    it("can use a rival Gig as the source for a friendly Gig value change", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [peaceOffering],
          eddies: peaceOffering.cost,
          gigArea: [
            { dieType: "d4", faceValue: 2 },
            { dieType: "d8", faceValue: 4 },
          ],
        },
        {
          gigArea: [{ dieType: "d6", faceValue: 4 }],
        },
      );

      engine.playCard(peaceOffering);
      const friendlyTargetGigId = engine.findGigIdByType(P1, "d4");
      const rivalSourceGigId = engine.findGigIdByType(P2, "d6");
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseTarget");
      if (choice?.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
        throw new Error("Expected Peace Offering target choice");
      }
      expect(choice.payload.eligibleIds).toEqual(
        expect.arrayContaining([friendlyTargetGigId, rivalSourceGigId]),
      );

      const result = engine.getLocalEngine().processCommand(
        {
          commandID: "resolve-peace-offering-rival-source",
          move: "resolveEffectTarget",
          input: { args: { targetIds: [rivalSourceGigId, friendlyTargetGigId] } },
        },
        P1,
      );

      expect(result.success).toBe(true);
      expect(engine.getState().G.gigDice[friendlyTargetGigId]!.faceValue).toBe(4);
      expect(engine.getHandCount(P1)).toBe(1);
    });
  });
});
