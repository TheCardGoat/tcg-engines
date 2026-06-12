import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  buildTargetResolutionContext,
  createMockUnit,
  evaluateTargetFilter,
  expectSuccess,
} from "@tcg/gundam-engine";
import { st02WingGundam001 } from "./001-wing-gundam.ts";

describe("Wing Gundam (ST02-001)", () => {
  describe("<Breach 5> and active Lv.4-or-lower attack target option", () => {
    it("data declares Breach 5 and constant chooseAttackTarget", () => {
      const effect = st02WingGundam001.effects?.[0];

      expect(st02WingGundam001.keywordEffects).toEqual([{ keyword: "Breach", value: 5 }]);
      expect(effect?.type).toBe("constant");
      expect(effect?.activation.timing).toBeUndefined();
      expect(effect?.directives).toEqual([
        {
          action: {
            action: "chooseAttackTarget",
            unit: { owner: "self", cardType: "unit" },
            attackTarget: {
              owner: "opponent",
              cardType: "unit",
              state: "active",
              attributeFilters: [{ attribute: "level", comparison: "lte", value: 4 }],
            },
            duration: "permanent",
          },
        },
      ]);
    });

    it("can attack an active enemy Lv.4 Unit", () => {
      const enemy = createMockUnit({ ap: 2, hp: 5, level: 4 });
      const engine = GundamTestEngine.create(
        { play: [st02WingGundam001], deck: 5 },
        { play: [enemy], deck: 5 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [wingId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.enterBattle(wingId!, enemyId!));
    });

    it("target option filter excludes active enemy Units above Lv.4", () => {
      const enemyLv4 = createMockUnit({ ap: 2, hp: 5, level: 4 });
      const enemyLv5 = createMockUnit({ ap: 2, hp: 5, level: 5 });
      const engine = GundamTestEngine.create(
        { play: [st02WingGundam001], deck: 5 },
        { play: [enemyLv4, enemyLv5], deck: 5 },
      );
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyLv4Id, enemyLv5Id] = p2.getCardsInZone("battleArea");
      const effect = st02WingGundam001.effects?.[0];
      const directive = effect?.directives[0];
      if (
        !directive ||
        !("action" in directive) ||
        directive.action.action !== "chooseAttackTarget"
      ) {
        throw new Error("Unexpected directive shape");
      }
      const rt = engine.getRuntime();
      const fw = rt.getFrameworkReadAPI();
      const cards = p2
        .getCardsInZone("battleArea")
        .map((id) => fw.cards.get(id))
        .filter(<T>(card: T | undefined): card is T => card !== undefined);
      const ctx = buildTargetResolutionContext(engine.getG(), PLAYER_ONE, fw, {
        sourceCardId: engine.asPlayer(PLAYER_ONE).getCardsInZone("battleArea")[0],
      });

      expect(evaluateTargetFilter(directive.action.attackTarget, cards, ctx)).toEqual([enemyLv4Id]);
      expect(evaluateTargetFilter(directive.action.attackTarget, cards, ctx)).not.toContain(
        enemyLv5Id,
      );
    });
  });
});
