import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMoxInciters,
  welcomeToNightCityRetailRidingNomad,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import { getEffectiveRules } from "../../../active-effects/index.ts";

const moxInciters = welcomeToNightCityRetailMoxInciters;

describe("Mox Inciters", () => {
  it("is the exact blue 3-cost 2-power Mox Ganger with Play incitement and BLOCKER", () => {
    expect(moxInciters).toMatchObject({
      canonicalId: "mox-inciters",
      slug: "mox-inciters",
      name: "Mox Inciters",
      displayName: "Mox Inciters",
      type: "unit",
      color: "blue",
      classifications: ["Ganger", "Mox"],
      cost: 3,
      power: 2,
      ram: 2,
      hasSellTag: false,
      printNumber: "122",
      timingTriggers: ["play"],
      keywords: ["blocker"],
      rulesText:
        "{Play} A rival Unit must attack next turn if it can.\n{Blocker} (You may spend this Unit to redirect a rival Unit's attack to it instead.)",
      abilities: [
        expect.objectContaining({ kind: "keyword", keyword: "blocker" }),
        {
          kind: "triggered",
          text: "Play A rival Unit must attack next turn if it can.",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          effects: [
            {
              effect: "grantRule",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
              rule: "mustAttack",
              duration: "untilSourceNextTurn",
            },
          ],
        },
      ],
    });
  });

  it("pays 3, enters with Lag, and offers exactly the rival Units for incitement", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [moxInciters], eddies: 3 },
      {
        field: [
          { card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
      },
    );

    engine.playCard(moxInciters, { as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(moxInciters, "field", P1).meta.hasLag).toBe(true);
    expect(engine.getPrompt(P1).choice).toMatchObject({
      type: "chooseTarget",
      payload: {
        type: "effectTarget",
        min: 1,
        max: 1,
        eligibleIds: expect.arrayContaining([
          engine.findCardId(welcomeToNightCityRetailRidingNomad, "field", P2),
          engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2),
        ]),
      },
    });
  });

  it("forces only the chosen rival Unit to attack next turn if it can", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [moxInciters],
        eddies: 3,
      },
      {
        field: [
          { card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false },
        ],
      },
    );

    engine.playCard(moxInciters, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.skipToNextPlayerTurn(P1);

    const prompt = engine.getPrompt(P2);
    const moveIds = prompt.availableMoves.map((move) => move.moveId);
    const incitedUnitId = engine.findCardId(welcomeToNightCityRetailRidingNomad, "field", P2);
    const directAttack = prompt.availableMoves.find((move) => move.moveId === "attackRival");

    expect(moveIds).not.toContain("passPhase");
    expect(directAttack).toMatchObject({ inputSpec: { type: "selectCard" } });
    if (directAttack?.inputSpec.type === "selectCard") {
      expect(directAttack.inputSpec.candidates).toEqual([incitedUnitId]);
    }

    const failure = engine.expectFailure(() => engine.passPhase({ as: P2 }));
    expect(failure.errorCode).toBe("MUST_ATTACK");
    expect(
      engine.expectFailure(() =>
        engine.attackRival(welcomeToNightCityRetailFieldOperator, { as: P2 }),
      ).errorCode,
    ).toBe("MUST_ATTACK");
  });

  it("allows the turn to continue after the incited Unit attacks", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [moxInciters],
        eddies: 3,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
    );

    engine.playCard(moxInciters, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.skipToNextPlayerTurn(P1);
    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P2 });
    engine.resolveFullSteal({ as: P2 });

    expect(engine.completeTurn({ as: P2 })).toMatchObject({ success: true });
  });

  it("lets the rival pass and expires the rule if the incited Unit can't attack", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [moxInciters],
        eddies: 3,
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: false, hasLag: false }],
      },
    );

    engine.playCard(moxInciters, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    const incitedUnitId = engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    engine.skipToNextPlayerTurn(P1);

    expect(engine.completeTurn({ as: P2 })).toMatchObject({ success: true });
    expect(getEffectiveRules(engine.getState(), incitedUnitId)).not.toContain("mustAttack");
  });

  it("does not break when there is no rival Unit to incite", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [moxInciters],
      eddies: 3,
    });

    engine.playCard(moxInciters, { as: P1 });
    engine.expectNoPendingChoice();
    engine.skipToNextPlayerTurn(P1);

    expect(engine.completeTurn({ as: P2 })).toMatchObject({ success: true });
  });

  it("can spend as BLOCKER to redirect a rival attack to itself", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: moxInciters, spent: false, hasLag: false }] },
      {
        field: [{ card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false }],
      },
      { activePlayerId: P2 },
    );

    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P2 });
    engine.resolveAttack({ as: P2 });
    engine.useBlocker(moxInciters, { as: P1 });

    expect(engine.getCard(moxInciters, "field", P1).meta.spent).toBe(true);
    expect(engine.getState().G.attackState).toMatchObject({
      kind: "fight",
      defenderId: engine.findCardId(moxInciters, "field", P1),
    });
    expect(engine.getEvents("blockerActivated")).toHaveLength(1);
  });
});
