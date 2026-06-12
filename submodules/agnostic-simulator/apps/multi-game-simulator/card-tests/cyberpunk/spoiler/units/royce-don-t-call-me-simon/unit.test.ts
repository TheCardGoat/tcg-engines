import { describe, expect, it } from "vite-plus/test";
import { enMessages, formatActionLog } from "@cyberpunk-engine/logging/index.ts";
import {
  CyberpunkTestEngine,
  P1,
  P2,
  expectAttackCandidate,
  expectNotAttackCandidate,
} from "@cyberpunk-engine/testing/index.ts";
import {
  alphaArmoredMinotaur,
  alphaRuthlessLowlife,
  alphaSwordwiseHuscle,
  spoilerRoyceDonTCallMeSimon,
} from "@tcg/cyberpunk-cards";
import { createMockUnit } from "@cyberpunk-engine/testing/index.ts";

const royce = spoilerRoyceDonTCallMeSimon; // unit, cost 5, power 4
const lowlife = alphaRuthlessLowlife; // unit, power 1
const huscle = alphaSwordwiseHuscle; // unit, power 5
const minotaur = alphaArmoredMinotaur; // unit, power 9
const powerThreeMock = createMockUnit({
  id: "royce-power-three-mock",
  slug: "royce-power-three-mock",
  name: "Power-3 Mock Unit",
  color: "red",
  power: 3,
});

function actionLogTexts(engine: CyberpunkTestEngine): string[] {
  return engine
    .getEvents("actionLog")
    .filter((event) => event.type === "actionLog")
    .map((event) => formatActionLog(event, enMessages));
}

describe("Royce - Don't Call Me Simon", () => {
  describe("UI prompt", () => {
    it("shows the unit as an attack candidate when ready", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: royce, spent: false }],
      });
      expectAttackCandidate(engine, royce);
    });

    it("does NOT show a spent unit as an attack candidate", () => {
      const engine = CyberpunkTestEngine.createWithFixture({
        field: [{ card: royce, spent: true }],
      });
      expectNotAttackCandidate(engine, royce);
    });
  });

  describe("[PLAY] Defeat a rival Unit (power 2 or less by default, 3 or less with more Street Cred)", () => {
    it("defeats a rival Unit with power 2 or less when Street Cred is not greater than rival's", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [royce],
          eddies: royce.cost,
          gigArea: [{ dieType: "d6", faceValue: 2 }],
        },
        {
          field: [{ card: lowlife, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 5 }],
        },
      );

      expect(engine.getStreetCred(P1)).toBe(2);
      expect(engine.getStreetCred(P2)).toBe(5);

      engine.playCard(royce);
      engine.resolveEffectTarget(lowlife);

      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === lowlife.id)).toBe(true);
    });

    it("CANNOT target a power-3 rival when Street Cred is not greater than rival's", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [royce],
          eddies: royce.cost,
          gigArea: [{ dieType: "d4", faceValue: 2 }],
        },
        {
          // Mock a power-3 unit by using huscle (power 5) — both above the maxPower:2
          field: [{ card: huscle, spent: false }],
          gigArea: [{ dieType: "d6", faceValue: 6 }],
        },
      );

      expect(engine.getStreetCred(P1)).toBeLessThan(engine.getStreetCred(P2));

      engine.playCard(royce);

      // No pending choice — no rival unit is power 2 or less and the higher
      // threshold branch is also gated by Street Cred.
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeFalsy();
      // Huscle survives.
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === huscle.id)).toBe(true);
    });

    it("defeats a rival Unit with power 3 when Street Cred is strictly greater than rival's", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [royce],
          eddies: royce.cost,
          gigArea: [{ dieType: "d10", faceValue: 10 }],
        },
        {
          field: [
            { card: powerThreeMock, spent: false },
            { card: huscle, spent: false }, // power 5 — never eligible
          ],
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
      );

      expect(engine.getStreetCred(P1)).toBeGreaterThan(engine.getStreetCred(P2));

      engine.playCard(royce);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      if (!choice || choice.type !== "chooseTarget" || choice.payload.type !== "effectTarget") {
        throw new Error("Expected Royce target choice");
      }
      expect(choice.payload.eligibleIds).toEqual([engine.getCard(powerThreeMock).instanceId]);

      const resolveResult = engine.resolveEffectTarget(powerThreeMock);
      const p2Trash = engine.getCardsInZone("trash", P2);
      expect(p2Trash.some((c) => c.definitionId === powerThreeMock.id)).toBe(true);
      expect(actionLogTexts(engine)).toContain(
        `${royce.displayName} defeated ${powerThreeMock.displayName}.`,
      );
      expect(resolveResult.moveLogs.map((log) => log.type === "action" && log.messageKey)).toEqual([
        "trigger.targetResolved",
        "trigger.defeatedTarget",
      ]);
    });

    it("only fires one branch (mutually exclusive Street Cred conditions)", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [royce],
          eddies: royce.cost,
          gigArea: [{ dieType: "d10", faceValue: 10 }],
        },
        {
          field: [{ card: lowlife, spent: false }],
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
      );

      engine.playCard(royce);
      engine.resolveEffectTarget(lowlife);

      // Only the high-threshold branch should have fired — lowlife is gone,
      // no additional pending choice.
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeFalsy();
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field).toHaveLength(0);
    });

    it("does nothing when no rival Unit is in range", () => {
      const engine = CyberpunkTestEngine.createWithFixture(
        {
          hand: [royce],
          eddies: royce.cost,
          gigArea: [{ dieType: "d10", faceValue: 10 }],
        },
        {
          // Only minotaur (power 9) — neither branch can target it.
          field: [{ card: minotaur, spent: false }],
          gigArea: [{ dieType: "d4", faceValue: 1 }],
        },
      );

      engine.playCard(royce);

      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice).toBeFalsy();
      const p2Field = engine.getCardsInZone("field", P2);
      expect(p2Field.some((c) => c.definitionId === minotaur.id)).toBe(true);
    });
  });

  describe("printed stats", () => {
    it("has the printed base power and cost", () => {
      expect(royce.cost).toBe(5);
      expect(royce.power).toBe(4);
      expect(royce.color).toBe("red");
      expect(royce.classifications).toEqual(["Ganger", "Maelstrom"]);
    });
  });
});
