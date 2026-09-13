import { describe, expect, it } from "vite-plus/test";
import {
  createMockPilot,
  createMockUnit,
  expectSuccess,
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
} from "@tcg/gundam-engine";
import type { CardEffect } from "@tcg/gundam-types";
import { expectBreachAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05NuGundam017 } from "./017-nu-gundam.ts";

// @behavioral-proof complete
describe("Nu Gundam (GD05-017)", () => {
  it("<Breach 5> deals exactly 5 damage after destroying a Unit in battle", () => {
    expectBreachAbility(gd05NuGundam017, 5);
  });

  describe("【When Paired】You may choose 3 (Londo Bell) cards from your trash. Exile them from the game. If you do, choose 1 enemy Unit. Begin a battle between this Unit and it and only perform the damage step.", () => {
    it("exiles exactly three Londo Bell cards, then stages an enemy target for damage-step-only battle", () => {
      const trashCards = [
        createMockUnit({ traits: ["londo bell"] }),
        createMockUnit({ traits: ["londo bell"] }),
        createMockUnit({ traits: ["londo bell"] }),
      ];
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const pilot = createMockPilot({ cost: 0, level: 0 });
      const engine = GundamTestEngine.create(
        { hand: [pilot], play: [gd05NuGundam017], trash: trashCards },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const trashIds = p1.getCardsInZone("trash");

      expectSuccess(p1.assignPilot(pilot, nuId));
      const exileChoice = p1.getBoardView().pendingChoice;
      if (exileChoice?.kind !== "targetSelection")
        throw new Error("Expected the Londo Bell exile choice");
      expect(exileChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: trashIds,
        minTargets: 3,
        maxTargets: 3,
      });
      expectSuccess(
        p1.resolveEffect({
          targets: trashIds,
          optionalAnswers: { [exileChoice.optionalDirectiveIndex!]: true },
        }),
      );
      expect(trashIds.every((id) => p1.getCardZone(id) === "removalArea")).toBe(true);

      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [enemyId],
      });
      expectSuccess(p1.resolveEffect({ targets: [enemyId] }));

      expect(p2.getCardZone(enemyId)).toBe(`trash:${PLAYER_TWO}`);
      expect(p1.getDamage(nuId)).toBe(4);
      expect(p1.isExhausted(nuId)).toBe(false);
    });

    it("leaves the trash and enemy Unit unchanged when the optional exile is declined", () => {
      const trashCards = [
        createMockUnit({ traits: ["londo bell"] }),
        createMockUnit({ traits: ["londo bell"] }),
        createMockUnit({ traits: ["londo bell"] }),
      ];
      const enemy = createMockUnit({ ap: 4, hp: 6 });
      const pilot = createMockPilot({ cost: 0, level: 0 });
      const engine = GundamTestEngine.create(
        { hand: [pilot], play: [gd05NuGundam017], trash: trashCards },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nuId = p1.getCardsInZone("battleArea")[0]!;
      const enemyId = p2.getCardsInZone("battleArea")[0]!;
      const trashIds = p1.getCardsInZone("trash");

      expectSuccess(p1.assignPilot(pilot, nuId));
      const exileChoice = p1.getBoardView().pendingChoice;
      if (exileChoice?.kind !== "targetSelection")
        throw new Error("Expected the Londo Bell exile choice");
      expectSuccess(
        p1.resolveEffect({
          optionalAnswers: { [exileChoice.optionalDirectiveIndex!]: false },
        }),
      );

      expect(p1.getCardsInZone("trash")).toEqual(trashIds);
      expect(p2.getCardZone(enemyId)).toBe(`battleArea:${PLAYER_TWO}`);
      expect(p1.getDamage(nuId)).toBe(0);
    });

    it("keeps battle-scoped protection active while resolving the damage-step-only battle", () => {
      const trashCards = [
        createMockUnit({ traits: ["londo bell"] }),
        createMockUnit({ traits: ["londo bell"] }),
        createMockUnit({ traits: ["londo bell"] }),
      ];
      const combatAwareDefender = createMockUnit({
        name: "Combat-Aware Defender",
        ap: 0,
        hp: 6,
        effects: [
          {
            type: "constant",
            activation: { timing: [] },
            directives: [
              {
                action: {
                  action: "preventDamage",
                  damageType: "battle",
                  target: { owner: "self", cardType: "unit" },
                  unitFilter: { owner: "opponent", cardType: "unit", isBattling: true },
                  duration: "permanent",
                },
              },
            ],
            sourceText: "While this Unit is battling, it can't receive battle damage.",
          },
        ] as CardEffect[],
      });
      const pilot = createMockPilot({ cost: 0, level: 0 });
      const engine = GundamTestEngine.create(
        { hand: [pilot], play: [gd05NuGundam017], trash: trashCards },
        { play: [combatAwareDefender] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const nuId = p1.getCardsInZone("battleArea")[0]!;
      const defenderId = p2.getCardsInZone("battleArea")[0]!;
      const trashIds = p1.getCardsInZone("trash");

      expectSuccess(p1.assignPilot(pilot, nuId));
      const exileChoice = p1.getBoardView().pendingChoice;
      if (exileChoice?.kind !== "targetSelection") {
        throw new Error("Expected the Londo Bell exile choice");
      }
      expectSuccess(
        p1.resolveEffect({
          targets: trashIds,
          optionalAnswers: { [exileChoice.optionalDirectiveIndex!]: true },
        }),
      );
      expectSuccess(p1.resolveEffect({ targets: [defenderId] }));

      expect(p2.getDamage(defenderId)).toBe(0);
      expect(p2.getCardZone(defenderId)).toBe(`battleArea:${PLAYER_TWO}`);
    });
  });
});
