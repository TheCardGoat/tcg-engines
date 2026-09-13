import { describe, expect, it } from "vite-plus/test";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCommand,
  createMockUnit,
  expectCard,
  expectFailure,
  expectPublicLog,
} from "@tcg/gundam-engine";
import { expectBaseBurstAndDeployAbilities } from "../../../test-helpers/base-behavior-test-helpers.ts";
import { gd05RaCailum125 } from "./125-ra-cailum.ts";

function enemyDamageCommand() {
  return createMockCommand({
    name: "Enemy Damage Command",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["action"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 3,
              target: { owner: "opponent", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Action】Deal 3 damage to 1 enemy Unit.",
      },
    ],
  });
}

function friendlyDamageCommand() {
  return createMockCommand({
    name: "Friendly Damage Command",
    level: 0,
    cost: 0,
    effects: [
      {
        type: "command",
        activation: { timing: ["main"] },
        directives: [
          {
            action: {
              action: "dealDamage",
              amount: 3,
              target: { owner: "friendly", cardType: "unit", count: 1 },
            },
          },
        ],
        sourceText: "【Main】Deal 3 damage to 1 friendly Unit.",
      },
    ],
  });
}

describe("Ra Cailum (GD05-125)", () => {
  describe("【Burst】Deploy this card. / 【Deploy】Add 1 of your Shields to your hand.", () => {
    it("executes its Burst deployment and Deploy Shield ability", () => {
      expectBaseBurstAndDeployAbilities(gd05RaCailum125);
    });
  });

  describe("【Activate･Main】Rest this Base：Choose 1 friendly (Londo Bell) Unit. During this turn, when it receives enemy damage, reduce it by 1.", () => {
    it("rests itself and reduces each enemy damage event to the chosen Londo Bell Unit by 1 this turn", () => {
      const londoBell = createMockUnit({
        name: "Londo Bell Attacker",
        traits: ["londo bell"],
        ap: 2,
        hp: 10,
      });
      const outsider = createMockUnit({ name: "Outsider", traits: ["aeug"], hp: 6 });
      const defender = createMockUnit({ name: "Enemy Defender", ap: 3, hp: 6 });
      const firstDamage = enemyDamageCommand();
      const secondDamage = enemyDamageCommand();
      const engine = GundamTestEngine.create(
        {
          play: [londoBell, outsider],
          baseSection: [gd05RaCailum125],
        },
        { hand: [firstDamage, secondDamage], play: [{ card: defender, exhausted: true }] },
      );
      const p1 = engine.asPlayer(PLAYER_ONE);
      const p2 = engine.asPlayer(PLAYER_TWO);

      p1.must.activateAbility(gd05RaCailum125, 0);
      expectPublicLog(engine, "gundam.move.activateAbility", {
        playerId: PLAYER_ONE,
      });
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [p1.unit(londoBell).instanceId],
      });
      p1.must.resolveTargets(londoBell);
      expectCard(p1, gd05RaCailum125).toBeRested();

      p1.must.attack(londoBell).into(defender);
      p2.must.passBlock();
      p2.must.playCommand(firstDamage, { targets: [londoBell] });
      p1.must.passBattleAction();
      p2.must.playCommand(secondDamage, { targets: [londoBell] });

      // `consuming: false` means the whole-turn reduction applies to both
      // independently resolved enemy damage events, not only the first one.
      expectCard(p1, londoBell).toHaveDamage(4);
      p1.must.passBattleAction();
      p2.must.passBattleAction();

      expectCard(p1, londoBell).toHaveDamage(6);
      expectCard(p1, outsider).toHaveDamage(0);
    });

    it("rejects a friendly Unit without the Londo Bell trait", () => {
      const londoBell = createMockUnit({
        name: "Londo Bell Ally",
        traits: ["londo bell"],
        hp: 6,
      });
      const outsider = createMockUnit({ name: "Outsider", traits: ["aeug"], hp: 6 });
      const engine = GundamTestEngine.create({
        play: [londoBell, outsider],
        baseSection: [gd05RaCailum125],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.activateAbility(gd05RaCailum125, 0);
      expect(p1.getBoardView().pendingChoice).toMatchObject({
        kind: "targetSelection",
        legalTargetIds: [p1.unit(londoBell).instanceId],
      });
      expectFailure(
        p1.resolveEffect({ targets: [p1.unit(outsider).instanceId] }),
        "ILLEGAL_TARGET",
      );
      p1.must.resolveTargets(londoBell);
      expectCard(p1, gd05RaCailum125).toBeRested();
    });

    it("cannot activate again while the Base is already rested", () => {
      const londoBell = createMockUnit({ traits: ["londo bell"], hp: 6 });
      const engine = GundamTestEngine.create({
        play: [londoBell],
        baseSection: [{ card: gd05RaCailum125, exhausted: true }],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      expectFailure(p1.activateAbility(gd05RaCailum125, 0), "CARD_EXHAUSTED");
    });

    it("does not reduce friendly-source damage to the chosen Unit", () => {
      const londoBell = createMockUnit({ traits: ["londo bell"], hp: 10 });
      const selfDamage = friendlyDamageCommand();
      const engine = GundamTestEngine.create({
        hand: [selfDamage],
        play: [londoBell],
        baseSection: [gd05RaCailum125],
      });
      const p1 = engine.asPlayer(PLAYER_ONE);

      p1.must.activateAbility(gd05RaCailum125, 0, { targets: [londoBell] });
      p1.must.playCommand(selfDamage, { targets: [londoBell] });

      expectCard(p1, londoBell).toHaveDamage(3);
    });
  });
});
