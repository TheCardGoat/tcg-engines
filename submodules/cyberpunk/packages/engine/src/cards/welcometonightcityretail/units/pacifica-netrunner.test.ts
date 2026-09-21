import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailPacificaNetrunner,
} from "@tcg/cyberpunk-cards";
import { getEffectivePower, getEffectiveRules } from "../../../active-effects/index.ts";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const netrunner = welcomeToNightCityRetailPacificaNetrunner;

describe("Pacifica Netrunner", () => {
  it("is the exact green 4-cost 1-power Netrunner with the conditional PLAY lock", () => {
    expect(netrunner).toMatchObject({
      canonicalId: "pacifica-netrunner",
      slug: "pacifica-netrunner",
      name: "Pacifica Netrunner",
      displayName: "Pacifica Netrunner",
      type: "unit",
      color: "green",
      classifications: ["Netrunner"],
      cost: 4,
      power: 1,
      ram: 2,
      hasSellTag: false,
      printNumber: "084",
      timingTriggers: ["play"],
      rulesText:
        "{Play} If your ☆ (Street Cred) is an even number, a rival Unit can't ready until your next turn.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedUnit",
              target: {
                selector: "card",
                controller: "rival",
                zones: ["field"],
                cardTypes: ["unit"],
                selection: { mode: "choose", min: 1, max: 1 },
              },
            },
          ],
          effects: [
            {
              effect: "grantRule",
              target: { selector: "bound", id: "selectedUnit" },
              rule: "cantReady",
              duration: "untilSourceNextTurn",
              conditions: [
                { condition: "streetCredParity", controller: "friendly", parity: "even" },
              ],
            },
          ],
        },
      ],
    });
  });

  it("pays 4 and offers every rival field Unit, regardless of orientation", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [netrunner],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
        ],
      },
    );

    engine.playCard(netrunner, { as: P1 });
    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getCard(netrunner, "field", P1)).toBeDefined();
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(pending).toMatchObject({ type: "chooseTarget", payload: { min: 1, max: 1 } });
    if (!pending || pending.type !== "chooseTarget") throw new Error("Expected rival Unit target");
    expect(new Set(pending.payload.eligibleIds)).toEqual(
      new Set([
        engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2),
        engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
      ]),
    );
    expect(pending.payload.eligibleIds).not.toContain(
      engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1),
    );
    expect(
      engine.executeMove(
        "resolveEffectTarget",
        {
          args: {
            targetIds: [engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P1)],
          },
        },
        P1,
      ),
    ).toMatchObject({ success: false, errorCode: "INVALID_CHOICE" });
  });

  it("locks a ready rival Unit without spending it", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [netrunner],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }] },
    );

    engine.playCard(netrunner, { as: P1 });

    const operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(operator.meta.spent).toBe(false);
    expect(getEffectiveRules(engine.getState(), operator.instanceId)).toContain("cantReady");
    expect(
      getEffectivePower(engine.getState(), engine.getCard(netrunner, "field", P1).instanceId),
    ).toBe(1);
  });

  it("keeps a spent rival Unit locked through its Ready Step and expires on the source next turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [netrunner],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: true, hasLag: false }] },
    );

    engine.playCard(netrunner, { as: P1 });
    engine.completeTurn({ as: P1 });

    let operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(operator.meta.spent).toBe(true);
    expect(getEffectiveRules(engine.getState(), operator.instanceId)).toContain("cantReady");

    engine.completeTurn({ as: P2 });
    operator = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(operator.meta.spent).toBe(true);
    expect(getEffectiveRules(engine.getState(), operator.instanceId)).not.toContain("cantReady");

    engine.completeTurn({ as: P1 });
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      false,
    );
  });

  it("does not prompt or grant the rule when Street Cred is odd", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [netrunner],
        eddies: 4,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );

    engine.playCard(netrunner, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeFalsy();
    const target = engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2);
    expect(target.meta.spent).toBe(true);
    expect(getEffectiveRules(engine.getState(), target.instanceId)).not.toContain("cantReady");
  });

  it("does not treat Null Street Cred as even", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [netrunner], eddies: 4 },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }] },
    );

    engine.playCard(netrunner, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeFalsy();
    const target = engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2);
    expect(getEffectiveRules(engine.getState(), target.instanceId)).not.toContain("cantReady");
  });
});
