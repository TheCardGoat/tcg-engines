import { describe, expect, it } from "vite-plus/test";
import {
  createMockBase,
  createMockCommand,
  createMockUnit,
  expectCard,
  expectLogType,
  expectPublicLog,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import { gd05MasterGundam033 } from "./033-master-gundam.ts";

describe("Master Gundam (GD05-033)", () => {
  describe("【Attack】You may choose 2 (Special Move) Command cards from your trash. Exile them from the game. If you do, deal 5 damage to the first card in your opponent's shield area.", () => {
    it("may exile two Special Move Commands to deal 5 to the first shield-area card", () => {
      const commands = Array.from({ length: 2 }, () =>
        createMockCommand({ traits: ["special move"] }),
      );
      const shield = createMockUnit({ hp: 8 });
      const base = createMockBase({ hp: 8 });
      const engine = GundamTestEngine.create(
        { play: [gd05MasterGundam033], trash: commands },
        { baseSection: [base], shieldArea: [shield] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const commandIds = p1.getCardsInZone("trash");

      p1.must.attack(gd05MasterGundam033).into("direct");
      expectPublicLog(engine, "gundam.move.attackDeclared", {
        attackerPlayerId: PLAYER_ONE,
      });
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "targetSelection")
        throw new Error("Expected Master Gundam's optional exile");
      p1.must.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } });
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: commandIds,
        minTargets: 2,
        maxTargets: 2,
      });
      p1.must.resolveEffect({ targets: commandIds });

      expectLogType(engine, "gundam.combat.damageDealt", { min: 1 });
      for (const commandId of commandIds) expect(p1.getCardZone(commandId)).toBe("removalArea");
      expectCard(p2, base).toHaveDamage(5);
      expect(p2.getCardsInZone("shieldArea")).toHaveLength(1);
    });

    it("exposes only (Special Move) Commands from trash as legal exile targets", () => {
      const specialA = createMockCommand({ traits: ["special move"] });
      const specialB = createMockCommand({ traits: ["special move"] });
      const nonSpecial = createMockCommand({ traits: ["earth federation"] });
      const base = createMockBase({ hp: 8 });
      const engine = GundamTestEngine.create(
        { play: [gd05MasterGundam033], trash: [specialA, specialB, nonSpecial] },
        { baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(gd05MasterGundam033).into("direct");
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "targetSelection")
        throw new Error("Expected Master Gundam's optional exile");
      p1.must.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } });

      const choice = p1.getBoardView().pendingChoice;
      if (choice?.kind !== "targetSelection") throw new Error("Expected Special Move target list");
      expect(choice.legalTargetIds).toEqual(
        expect.arrayContaining([
          p1.cardIn("trash", specialA).instanceId,
          p1.cardIn("trash", specialB).instanceId,
        ]),
      );
      expect(choice.legalTargetIds).not.toContain(p1.cardIn("trash", nonSpecial).instanceId);
      p1.must.resolveEffect({ targets: [specialA, specialB] });

      expect(p1.getCardZone(specialA)).toBe("removalArea");
      expect(p1.getCardZone(specialB)).toBe("removalArea");
      expectCard(p1, nonSpecial).toBeIn("trash");
      expectCard(p2, base).toHaveDamage(5);
    });

    it("does not exile cards or deal damage when its optional cost is declined", () => {
      const commands = Array.from({ length: 2 }, () =>
        createMockCommand({ traits: ["special move"] }),
      );
      const base = createMockBase({ hp: 8 });
      const engine = GundamTestEngine.create(
        { play: [gd05MasterGundam033], trash: commands },
        { baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(gd05MasterGundam033).into("direct");
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind !== "targetSelection")
        throw new Error("Expected Master Gundam's optional exile");
      p1.must.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: false } });

      expectCard(p1, commands[0]!).toBeIn("trash");
      expectCard(p1, commands[1]!).toBeIn("trash");
      expectCard(p2, base).toHaveDamage(0);
    });

    it("does not deal shield damage when fewer than 2 Special Move Commands are in trash", () => {
      const onlyOne = createMockCommand({ traits: ["special move"] });
      const base = createMockBase({ hp: 8 });
      const engine = GundamTestEngine.create(
        { play: [gd05MasterGundam033], trash: [onlyOne] },
        { baseSection: [base] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.attack(gd05MasterGundam033).into("direct");

      // With only one legal Special Move, the optional exile is not a viable path:
      // either no prompt, or accepting cannot complete a 2-card exile.
      const optional = p1.getBoardView().pendingChoice;
      if (optional?.kind === "targetSelection") {
        p1.must.resolveEffect({ optionalAnswers: { [optional.directiveIndex]: true } });
        const followUp = p1.getBoardView().pendingChoice;
        if (followUp?.kind === "targetSelection") {
          expect(followUp.legalTargetIds).toHaveLength(1);
          p1.must.resolveEffect({ optionalAnswers: { [followUp.directiveIndex]: false } });
        }
      }

      expectCard(p1, onlyOne).toBeIn("trash");
      expectCard(p2, base).toHaveDamage(0);
    });
  });
});
