import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectBlockerAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { gd05AlphaAzieru054 } from "./054-alpha-azieru.ts";

describe("Alpha Azieru (GD05-054)", () => {
  it("<Blocker> rests this Unit and redirects an attack to it", () => {
    expectBlockerAbility(gd05AlphaAzieru054);
  });

  describe("【Once per Turn】When one of your Units is destroyed by an effect, draw 1.", () => {
    it("draws when a different friendly Unit is destroyed by an effect", () => {
      const destroy = createMockCommand({
        name: "Friendly Destruction",
        level: 0,
        cost: 0,
        effects: [
          {
            type: "command",
            activation: { timing: ["main"] },
            directives: [
              {
                action: {
                  action: "destroy",
                  target: { owner: "friendly", cardType: "unit", count: 1 },
                },
              },
            ],
            sourceText: "【Main】Destroy 1 friendly Unit.",
          },
        ],
      });
      const victim = createMockUnit({ name: "Effect-destroyed Unit", hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [destroy],
        play: [gd05AlphaAzieru054, victim],
        deck: 3,
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [, victimId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(destroy));
      expectSuccess(p1.resolveEffect({ targets: [victimId!] }));

      expect(p1.getCardZone(victimId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(1);
    });

    it("does not draw when the friendly Unit is destroyed by battle damage", () => {
      const victim = createMockUnit({ name: "Battle-destroyed Unit", hp: 1 });
      const attacker = createMockUnit({ name: "Enemy Attacker", ap: 1, hp: 5 });
      const engine = GundamTestEngine.create(
        { play: [gd05AlphaAzieru054, { card: victim, exhausted: true }], deck: 3 },
        { play: [attacker], deck: 3 },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [, victimId] = p1.getCardsInZone("battleArea");
      const attackerId = p2.getCardsInZone("battleArea")[0]!;

      expectSuccess(p1.passPhase());
      expectSuccess(p2.passActionStep());
      expectSuccess(p1.passActionStep());
      expectSuccess(p2.enterBattle(attackerId, victimId!));
      expectSuccess(p1.passBlock());
      expectSuccess(p1.passBattleAction());
      expectSuccess(p2.passBattleAction());

      expect(p1.getCardZone(victimId!)).toBe(`trash:${PLAYER_ONE}`);
      expect(p1.getHand()).toHaveLength(0);
    });
  });
});
