import { describe, expect, it } from "vite-plus/test";
import type { CardEffect } from "@tcg/gundam-types";
import {
  GundamTestEngine,
  PLAYER_ONE,
  PLAYER_TWO,
  createMockCommand,
  createMockResource,
  createMockUnit,
  expectSuccess,
} from "../../index.ts";

const replayActionBurst: CardEffect = {
  type: "triggered",
  activation: { timing: ["burst"] },
  directives: [{ action: { action: "activateTiming", timing: "action" } }],
  sourceText: "【Burst】Activate this card's 【Action】.",
};

const targetedAction: CardEffect = {
  type: "command",
  activation: { timing: ["action"] },
  directives: [
    {
      action: {
        action: "returnToHand",
        target: {
          owner: "opponent",
          cardType: "unit",
          count: 1,
          attributeFilters: [{ attribute: "level", comparison: "lte", value: 3 }],
        },
      },
    },
  ],
  sourceText: "【Action】Return 1 enemy Unit that is Lv.3 or lower to hand.",
};

describe("activateTiming Burst eligibility", () => {
  it("does not enqueue Burst when the replayed timing has no legal required target", () => {
    const replayCommand = createMockCommand({ effects: [replayActionBurst, targetedAction] });
    const highLevelAttacker = createMockUnit({ level: 4, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { shieldArea: [replayCommand] },
      { play: [highLevelAttacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toBeUndefined();
    expect(p1.getCardZone(shieldId)).toBe(`trash:${PLAYER_ONE}`);
  });

  it("guards cyclic timing replays while checking Burst eligibility", () => {
    const replayMainBurst: CardEffect = {
      type: "triggered",
      activation: { timing: ["burst"] },
      directives: [{ action: { action: "activateTiming", timing: "main" } }],
      sourceText: "【Burst】Activate this card's 【Main】.",
    };
    const cyclicMain: CardEffect = {
      type: "command",
      activation: { timing: ["main"] },
      directives: [{ action: { action: "activateTiming", timing: "main" } }],
      sourceText: "【Main】Activate this card's 【Main】.",
    };
    const cyclicCommand = createMockCommand({ effects: [replayMainBurst, cyclicMain] });
    const attacker = createMockUnit({ level: 4, ap: 1, hp: 4 });
    const engine = GundamTestEngine.create(
      { shieldArea: [cyclicCommand] },
      { play: [attacker] },
      { initialActivePlayer: PLAYER_TWO },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const p2 = engine.asPlayer(PLAYER_TWO);
    const shieldId = p1.getCardsInZone("shieldArea")[0]!;
    const attackerId = p2.getCardsInZone("battleArea")[0]!;

    expectSuccess(p2.enterBattle(attackerId, "direct"));
    expectSuccess(p1.passBlock());
    expectSuccess(p1.passBattleAction());
    expectSuccess(p2.passBattleAction());

    expect(p1.getBoardView().pendingChoice).toMatchObject({
      kind: "optional",
      sourceCardId: shieldId,
      directiveIndex: -1,
    });
  });
});

describe("activateTiming indirect Command activation", () => {
  it("does not record a paired Special Move replay when its first public target is missing", () => {
    const host = createMockUnit({
      effects: [
        {
          type: "triggered",
          activation: { timing: ["attack"] },
          directives: [{ action: { action: "activatePairedCardTiming", timing: "main" } }],
          sourceText: "【Attack】Activate 【Main】 on the card paired with this Unit.",
        },
      ],
    });
    const specialMove = createMockCommand({
      name: "Test Special Move",
      traits: ["special move"],
      pilotName: "Test Pilot",
      level: 1,
      cost: 1,
      effects: [
        {
          type: "command",
          activation: { timing: ["main"] },
          directives: [
            {
              action: {
                action: "dealDamage",
                amount: 2,
                target: { owner: "opponent", cardType: "unit", count: 1 },
              },
            },
          ],
          sourceText: "【Main】Choose 1 enemy Unit. Deal 2 damage to it.",
        },
      ],
    });
    const observer = createMockUnit({
      effects: [
        {
          type: "triggered",
          activation: {
            timing: ["onCommandEffectActivated"],
            conditions: [
              { type: "eventPlayerIsSelf" },
              {
                type: "eventCardMatches",
                target: {
                  owner: "friendly",
                  cardType: "command",
                  attributeFilters: [
                    { attribute: "trait", comparison: "includes", value: "special move" },
                  ],
                },
              },
            ],
          },
          directives: [
            {
              action: {
                action: "grantKeyword",
                keyword: "Suppression",
                duration: "thisTurn",
                target: { owner: "self", cardType: "unit" },
              },
            },
          ],
          sourceText:
            "When you activate a (Special Move) Command's 【Main】/【Action】, this Unit gains <Suppression> during this turn.",
        },
      ],
    });
    const engine = GundamTestEngine.create(
      {
        hand: [specialMove],
        play: [host, observer],
        resourceArea: [{ card: createMockResource(), exhausted: false }],
      },
      { shieldArea: [createMockUnit()] },
    );
    const p1 = engine.asPlayer(PLAYER_ONE);
    const [hostId, observerId] = p1.getCardsInZone("battleArea");

    expectSuccess(p1.playCommandAsPilot(specialMove, hostId!));
    expectSuccess(p1.enterBattle(hostId!, "direct"));

    expect(p1.getVisibleCard(observerId!)?.keywords).not.toContain("Suppression");
    expect(p1.getBoardView().pendingChoice).toBeUndefined();
  });
});
