import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailAnimalsWrecker,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailGorillaArms,
  welcomeToNightCityRetailOffdutyMalfini,
  welcomeToNightCityRetailRogueAmendiaresQueenOfTheAfterlife,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const rogue = welcomeToNightCityRetailRogueAmendiaresQueenOfTheAfterlife;

describe("Rogue Amendiares — Queen of the Afterlife", () => {
  it("has the exact blue QUICK Fixer Merc identity and both executable abilities", () => {
    expect(rogue).toMatchObject({
      canonicalId: "rogue-amendiares-queen-of-the-afterlife",
      slug: "rogue-amendiares-queen-of-the-afterlife",
      name: "Rogue Amendiares",
      subname: "Queen of the Afterlife",
      displayName: "Rogue Amendiares: Queen of the Afterlife",
      type: "unit",
      color: "blue",
      classifications: ["Fixer", "Merc"],
      cost: 5,
      power: 4,
      ram: 2,
      hasSellTag: false,
      rarity: "Epic",
      printNumber: "126",
      keywords: ["quick"],
      rulesText:
        "The first time another friendly Unit steals a Gig with value less than its power each turn, ready 2 Eddies.\n{Quick} 2 €$,  {Spend} A rival Unit loses power equal to this Unit's power this turn.",
      abilities: [
        { kind: "keyword", keyword: "quick" },
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "gigStolen",
              player: "friendly",
              minAmount: 1,
              valueLessThanSourcePower: true,
              source: {
                controller: "friendly",
                zones: ["field"],
                cardTypes: ["unit"],
                excludeSelf: true,
              },
            },
          },
          limits: ["firstTimeEachTurn"],
          effects: [{ effect: "readyEddies", player: "friendly", amount: 2 }],
        },
        {
          kind: "triggered",
          trigger: { trigger: "activated" },
          costs: [
            { cost: "payEddies", amount: 2 },
            { cost: "spend", target: { selector: "self" } },
          ],
          effects: [
            {
              effect: "modifyPower",
              value: { type: "sourcePower", multiplier: -1 },
              duration: "turn",
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 5 Eddies and enters the field with Lag", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [rogue],
      legendArea: [],
      eddies: 5,
    });

    engine.playCard(rogue, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    const played = engine.getCard(rogue, "field", P1);
    expect(played.meta.hasLag).toBe(true);
    expect(played.meta.spent).toBe(false);
  });

  it("readies 2 Eddies the first time another friendly Unit steals a Gig below its power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: rogue, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailAnimalsWrecker, spent: false, hasLag: false },
        ],
        eddies: 1,
        spentEddies: 2,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailAnimalsWrecker, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getEddies(P1)).toBe(3);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(0);
  });

  it("does not ready Eddies when this Unit itself steals", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: rogue, spent: false, hasLag: false }],
        eddies: 1,
        spentEddies: 2,
      },
      {
        gigArea: [{ dieType: "d4", faceValue: 1 }],
      },
    );

    engine.attackRival(rogue, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEddies(P1)).toBe(1);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(2);
  });

  it("does not ready Eddies when the stolen Gig value equals the other Unit's power", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: rogue, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailAnimalsWrecker, spent: false, hasLag: false },
        ],
        spentEddies: 2,
      },
      { gigArea: [{ dieType: "d10", faceValue: 10 }] },
    );

    engine.attackRival(welcomeToNightCityRetailAnimalsWrecker, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(2);
  });

  it("readies only 2 Eddies when Gorilla Arms causes a second qualifying steal that turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: rogue, spent: false, hasLag: false },
          {
            card: welcomeToNightCityRetailOffdutyMalfini,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailGorillaArms],
          },
        ],
        spentEddies: 4,
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );

    engine.attackRival(welcomeToNightCityRetailOffdutyMalfini, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(triggerChoice?.type).toBe("chooseTrigger");
    if (!triggerChoice || triggerChoice.type !== "chooseTrigger") {
      throw new Error("Expected Rogue and Gorilla Arms trigger ordering");
    }
    const rogueId = engine.getCard(rogue, "field", P1).instanceId;
    const rogueTrigger = triggerChoice.payload.options.find(
      (option) => option.sourceCardId === rogueId,
    );
    if (!rogueTrigger) throw new Error("Expected Rogue's ready-Eddies trigger");
    engine.executeMove("resolveTrigger", { args: { triggerId: rogueTrigger.triggerId } }, P1);

    const gigChoice = engine.getState().G.turnMetadata.pendingChoice;
    expect(gigChoice?.type).toBe("chooseTarget");
    if (!gigChoice || gigChoice.type !== "chooseTarget") {
      throw new Error("Expected Gorilla Arms Gig target");
    }
    const cascadeTarget = gigChoice.payload.eligibleIds?.[0];
    if (!cascadeTarget) throw new Error("Expected an eligible Gorilla Arms Gig");
    engine.resolveEffectTargetIds([cascadeTarget], {
      as: P1,
      allowPendingChoice: true,
      reason: "the cascade queues same-turn triggers whose first-time limits must auto-drain",
    });
    for (;;) {
      const pending = engine.getState().G.turnMetadata.pendingChoice;
      if (!pending || pending.type !== "chooseTrigger") break;
      const next = pending.payload.options[0];
      if (!next) throw new Error("Expected queued cascade trigger");
      engine.executeMove("resolveTrigger", { args: { triggerId: next.triggerId } }, P1);
    }

    expect(engine.getEddies(P1)).toBe(2);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(2);
    expect(engine.getEvents("gigStolen")).toHaveLength(2);
  });

  it("can ready 2 Eddies again from the first qualifying steal of its next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: rogue, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
        spentEddies: 4,
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    const firstGig = engine.findGigIdByType(P2, "d4");
    const secondGig = engine.findGigIdByType(P2, "d6");

    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: [firstGig] });
    expect(engine.getEddies(P1)).toBe(2);

    engine.completeTurn({ as: P1 });
    engine.completeTurn({ as: P2 });
    engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1, gigIdsToSteal: [secondGig] });

    expect(engine.getEddies(P1)).toBe(4);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(0);
  });

  it("spends itself and 2 €$ to make a rival Unit lose this Unit's power this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: rogue, spent: false, hasLag: false }],
        eddies: 2,
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
    );

    engine.activateAbility(rogue, 2, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    const operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(engine.getCard(rogue, "field", P1).meta.spent).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
    expect(welcomeToNightCityRetailFieldOperator.power).toBe(2);
    expect(rogue.power).toBe(4);
    expect(
      engine
        .getState()
        .G.activeEffects.some(
          (effect) =>
            effect.kind === "powerModifier" &&
            effect.targetCardId === operator.instanceId &&
            effect.powerModifier === -rogue.power,
        ),
    ).toBe(true);
    expect(getEffectivePower(engine.getState(), operator.instanceId as string)).toBe(0);
  });

  it("rejects the activated ability without 2 Eddies and does not spend Rogue", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: rogue, spent: false, hasLag: false }], eddies: 1 },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }] },
    );
    engine.spendAllLegends(P1);

    const failure = engine.expectFailure(() => engine.activateAbility(rogue, 2, { as: P1 }));
    expect(failure.errorCode).toBe("INSUFFICIENT_EDDIES");
    expect(engine.getCard(rogue, "field", P1).meta.spent).toBe(false);
    expect(engine.getEddies(P1)).toBe(1);
  });

  it("uses Rogue's effective power and removes the loss at the end of the turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: rogue, spent: false, hasLag: false, powerModifier: 2 }], eddies: 2 },
      { field: [{ card: welcomeToNightCityRetailAnimalsWrecker, spent: false }] },
    );
    const target = engine.getCard(welcomeToNightCityRetailAnimalsWrecker, "field", P2);

    engine.activateAbility(rogue, 2, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailAnimalsWrecker, { as: P1 });
    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(4);

    engine.completeTurn({ as: P1 });
    expect(getEffectivePower(engine.getState(), target.instanceId)).toBe(10);
  });

  it("activates as QUICK during a rival attack before that attack resolves", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: rogue, spent: false, hasLag: false }], eddies: 2 },
      {
        field: [{ card: welcomeToNightCityRetailAnimalsWrecker, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d6", faceValue: 1 }],
      },
    );
    const attacker = engine.getCard(welcomeToNightCityRetailAnimalsWrecker, "field", P2);
    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });

    engine.attackRival(welcomeToNightCityRetailAnimalsWrecker, { as: P2 });
    engine.resolveAttack({ as: P2 });
    expect(engine.activateAbility(rogue, 2, { as: P1 }).success).toBe(true);
    engine.resolveEffectTarget(welcomeToNightCityRetailAnimalsWrecker, { as: P1 });

    expect(getEffectivePower(engine.getState(), attacker.instanceId)).toBe(6);
    expect(engine.getCard(rogue, "field", P1).meta.spent).toBe(true);
    expect(engine.getEddies(P1)).toBe(0);
  });
});
