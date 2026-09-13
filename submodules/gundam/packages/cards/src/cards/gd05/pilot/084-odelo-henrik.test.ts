import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  activeResources,
  createMockCommand,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";
import { expectPilotBurstAddsToHand } from "../../../test-helpers/pilot-behavior-test-helpers.ts";
import { gd05OdeloHenrik084 } from "./084-odelo-henrik.ts";

describe("Odelo Henrik (GD05-084)", () => {
  it("executes its Burst and pairs through public moves", () => {
    expectPilotBurstAddsToHand(gd05OdeloHenrik084);
    const unit = createMockUnit({ ap: 2, hp: 4 });
    const engine = GundamTestEngine.create({
      hand: [gd05OdeloHenrik084],
      play: [unit],
      resourceArea: activeResources(3),
    });
    const p1 = engine.asPlayer(PLAYER_ONE);
    const unitId = p1.getCardsInZone("battleArea")[0]!;

    expectSuccess(p1.assignPilot(gd05OdeloHenrik084, unitId));
    expect(p1.getPilotId(unitId)).toBeDefined();
  });

  describe("When one of your (League Militaire) Unit tokens receives enemy effect damage, reduce it by 1.", () => {
    function enemyDamageCommand(targetCount = 1) {
      return createMockCommand({
        name: "Enemy Damage",
        level: 1,
        cost: 1,
        effects: [
          {
            type: "command",
            activation: { timing: ["action"] },
            directives: [
              {
                action: {
                  action: "dealDamage",
                  amount: 2,
                  target: { owner: "opponent", cardType: "unit", count: targetCount },
                },
              },
            ],
            sourceText: "【Action】Choose 1 enemy Unit. Deal 2 damage to it.",
          },
        ],
      });
    }

    it("reduces enemy effect damage to a separate friendly League Militaire Unit token", () => {
      const host = createMockUnit({ name: "Odelo Host", hp: 8 });
      const token = createMockUnit({
        name: "League Militaire Token",
        traits: ["league militaire"],
        hp: 8,
      });
      const damage = enemyDamageCommand();
      const engine = GundamTestEngine.create(
        {
          hand: [gd05OdeloHenrik084],
          play: [host, { card: token, isToken: true }],
          resourceArea: activeResources(3),
        },
        { hand: [damage], resourceArea: activeResources(1) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, tokenId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd05OdeloHenrik084, hostId!));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(damage));
      expectSuccess(p2.resolveEffect({ targets: [tokenId!] }));

      expect(p1.getDamage(tokenId!)).toBe(1);
    });

    it("does not reduce enemy effect damage to a non-token or a token without the trait", () => {
      const host = createMockUnit({ name: "Odelo Host", hp: 8 });
      const nonToken = createMockUnit({
        name: "League Militaire Unit",
        traits: ["league militaire"],
        hp: 8,
      });
      const wrongTraitToken = createMockUnit({
        name: "Wrong Trait Token",
        traits: ["zeon"],
        hp: 8,
      });
      const damage = enemyDamageCommand(2);
      const engine = GundamTestEngine.create(
        {
          hand: [gd05OdeloHenrik084],
          play: [host, nonToken, { card: wrongTraitToken, isToken: true }],
          resourceArea: activeResources(3),
        },
        { hand: [damage], resourceArea: activeResources(1) },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);
      const [hostId, nonTokenId, wrongTraitTokenId] = p1.getCardsInZone("battleArea");

      expectSuccess(p1.assignPilot(gd05OdeloHenrik084, hostId!));
      expectSuccess(p1.passPhase());
      expectSuccess(p2.playCommand(damage));
      expectSuccess(p2.resolveEffect({ targets: [nonTokenId!, wrongTraitTokenId!] }));

      expect(p1.getDamage(nonTokenId!)).toBe(2);
      expect(p1.getDamage(wrongTraitTokenId!)).toBe(2);
    });
  });
});
