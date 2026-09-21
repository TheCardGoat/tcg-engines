import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMemoryRelapse,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const relapse = welcomeToNightCityRetailMemoryRelapse;

describe("Memory Relapse", () => {
  it("is the exact green 3-cost Braindance Program with spend, lock, and conditional draw", () => {
    expect(relapse).toMatchObject({
      canonicalId: "memory-relapse",
      slug: "memory-relapse",
      name: "Memory Relapse",
      displayName: "Memory Relapse",
      type: "program",
      color: "green",
      classifications: ["Braindance"],
      cost: 3,
      power: null,
      ram: 2,
      hasSellTag: true,
      printNumber: "100",
      timingTriggers: ["play"],
      rulesText:
        "Spend a rival Unit. It can't ready until your next turn. If your ☆ (Street Cred) is an even number, draw 1.",
    });
    expect(relapse.abilities).toEqual([
      expect.objectContaining({
        trigger: { trigger: "play" },
        source: { selector: "self" },
        bindings: [
          {
            id: "unit",
            target: {
              selector: "card",
              controller: "rival",
              zones: ["field"],
              cardTypes: ["unit"],
              state: "ready",
              selection: { mode: "choose", min: 1, max: 1 },
            },
          },
        ],
        effects: [
          { effect: "spend", target: { selector: "bound", id: "unit" } },
          {
            effect: "grantRule",
            target: { selector: "bound", id: "unit" },
            rule: "cantReady",
            duration: "untilSourceNextTurn",
          },
          {
            effect: "draw",
            player: "friendly",
            amount: 1,
            conditions: [{ condition: "streetCredParity", controller: "friendly", parity: "even" }],
          },
        ],
      }),
    ]);
  });

  it("spends a rival Unit, blocks its next Ready Step, expires next turn, and draws on even Street Cred", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
      { preserveDeckOrder: true },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(relapse, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      true,
    );
    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );

    engine.completeTurn({ as: P1 });
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      true,
    );

    engine.completeTurn({ as: P2 });
    expect(engine.getActivePlayerId()).toBe(P1);
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      true,
    );

    engine.completeTurn({ as: P1 });
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      false,
    );
  });

  it("does not draw when Street Cred is odd", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
      },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(relapse, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    expect(engine.getCard(welcomeToNightCityRetailFieldOperator, "field", P2).meta.spent).toBe(
      true,
    );
  });

  it("does not treat Null Street Cred as even", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      { hand: [relapse], deck: [welcomeToNightCityRetailFieldOperator], eddies: 3 },
      { field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }] },
      { preserveDeckOrder: true },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(relapse, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailFieldOperator, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
  });

  it("offers only rival ready field Units as the mandatory target", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false }],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {
        field: [
          { card: welcomeToNightCityRetailFieldOperator, spent: false },
          { card: welcomeToNightCityRetailCorpoSecurity, spent: true },
        ],
      },
    );

    engine.playCard(relapse, { as: P1 });
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    expect(pending).toMatchObject({ type: "chooseTarget", payload: { min: 1, max: 1 } });
    if (!pending || pending.type !== "chooseTarget") throw new Error("Expected Unit target");
    expect(pending.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2),
    ]);
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

  it("still draws on even Street Cred when no rival ready Unit can be spent", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
      { preserveDeckOrder: true },
    );

    engine.playCard(relapse, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
    expect(engine.getCard(relapse, "trash", P1)).toBeDefined();
  });
});
