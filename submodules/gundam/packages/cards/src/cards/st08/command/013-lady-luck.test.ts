import { describe, it, expect } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockUnit,
  expectFailure,
  expectSuccess,
  getDamageCounter,
  markAsLinkUnit,
} from "@tcg/gundam-engine";
import { st08LadyLuck013 } from "./013-lady-luck.ts";

describe("Lady Luck (ST08-013)", () => {
  describe("【Main】/【Action】Choose 1 enemy Unit. Deal 1 damage to it. If a friendly (Mafty) Link Unit is in play, deal 2 damage instead.", () => {
    it("data encodes Mafty Link Unit condition with 2-damage and 1-damage branches", () => {
      const effect = st08LadyLuck013.effects?.[0];
      const directive = effect?.directives[0];

      expect(effect?.type).toBe("command");
      expect(effect?.activation.timing).toEqual(["main", "action"]);
      if (!directive || !("condition" in directive)) throw new Error("Unexpected directive shape");
      expect(directive.condition).toEqual({
        type: "unitCount",
        owner: "friendly",
        comparison: "gte",
        count: 1,
        hasTrait: "mafty",
        isLinkUnit: true,
      });
      expect(directive.thenDirectives).toEqual([
        {
          action: {
            action: "dealDamage",
            amount: 2,
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ]);
      expect(directive.elseDirectives).toEqual([
        {
          action: {
            action: "dealDamage",
            amount: 1,
            target: { owner: "opponent", cardType: "unit", count: 1 },
          },
        },
      ]);
    });

    it("deals 1 damage without a friendly Mafty Link Unit", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08LadyLuck013], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(1);
    });

    it("deals 2 damage while a friendly Mafty Link Unit is in play", () => {
      const maftyLink = createMockUnit({ traits: ["mafty"], ap: 3, hp: 5 });
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08LadyLuck013], play: [maftyLink], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [maftyId] = p1.getCardsInZone("battleArea");
      const [enemyId] = p2.getCardsInZone("battleArea");
      markAsLinkUnit(engine, maftyId!);

      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(2);
    });

    it("also works at action timing", () => {
      const enemy = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create(
        { hand: [st08LadyLuck013], resourceArea: activeResources(5) },
        { play: [enemy] },
      );
      engine.setPhase("end-phase");
      engine.setStep("action-step");
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [enemyId] = p2.getCardsInZone("battleArea");

      expectSuccess(p1.playCommand(st08LadyLuck013, { targets: [enemyId!] }));

      expect(getDamageCounter(engine, enemyId!)).toBe(1);
    });

    it("rejects a friendly Unit target", () => {
      const friendly = createMockUnit({ ap: 3, hp: 5 });
      const engine = GundamTestEngine.create({
        hand: [st08LadyLuck013],
        play: [friendly],
        resourceArea: activeResources(5),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const [friendlyId] = p1.getCardsInZone("battleArea");

      expectFailure(p1.playCommand(st08LadyLuck013, { targets: [friendlyId!] }), "INVALID_TARGET");
    });
  });
});
