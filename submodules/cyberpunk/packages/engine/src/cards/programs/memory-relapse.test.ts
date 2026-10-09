import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMemoryRelapse,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";
import { enMessages, formatActionLog } from "../../logging/index.ts";

const relapse = welcomeToNightCityRetailMemoryRelapse;

describe("Memory Relapse", () => {
  it("is the exact green 4-cost Braindance Program with spend, lock, and conditional draw", () => {
    expect(relapse).toMatchObject({
      canonicalId: "memory-relapse",
      slug: "memory-relapse",
      name: "Memory Relapse",
      displayName: "Memory Relapse",
      type: "program",
      color: "green",
      classifications: ["Braindance"],
      cost: 4,
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

  it("offers every rival field Unit, ready or spent, as the mandatory target", () => {
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
    expect(pending.payload.eligibleIds).toHaveLength(2);
    expect(pending.payload.eligibleIds).toEqual(
      expect.arrayContaining([
        engine.findCardId(welcomeToNightCityRetailFieldOperator, "field", P2),
        engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
      ]),
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

  it("targets an already-spent rival Unit: the spend no-ops, the lock holds, and even Street Cred draws", () => {
    // Official FAQ on Memory Relapse: an already-spent (horizontal) Unit is a
    // legal target; the "spend it" instruction fails as a no-op while the
    // rest of the effect still resolves. The cantReady rider therefore lands
    // on a Unit this card never flipped — the lock keying off the (unchanged)
    // spent state keeps it horizontal through P2's next Ready Step and only
    // releases after the SOURCE player's next turn (duration
    // untilSourceNextTurn). Same rulings family as CR 2.4 / 10.2.1 / 10.6.2 /
    // 3.7 — see tests/comprehensive-rules/cr-faq-rulings.test.ts.
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
    const handBefore = engine.getHandCount(P1);

    engine.playCard(relapse, { as: P1 });
    const pending = engine.getState().G.turnMetadata.pendingChoice;
    if (!pending || pending.type !== "chooseTarget") throw new Error("Expected Unit target");
    expect(pending.payload.eligibleIds).toEqual([
      engine.findCardId(welcomeToNightCityRetailCorpoSecurity, "field", P2),
    ]);
    // The spend instruction no-ops: no cardSpent event may fire for the
    // chosen target. (The count is taken after the program's own play-cost
    // payment so only the target spend is under test.)
    const spendEventsBefore = engine.getEvents("cardSpent").length;
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });
    expect(engine.getEvents("cardSpent")).toHaveLength(spendEventsBefore);
    expect(engine.getHandCount(P1)).toBe(handBefore);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );

    engine.completeTurn({ as: P1 });
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );

    engine.completeTurn({ as: P2 });
    expect(engine.getActivePlayerId()).toBe(P1);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );

    engine.completeTurn({ as: P1 });
    expect(engine.getActivePlayerId()).toBe(P2);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      false,
    );
  });

  it("targets an already-spent rival Unit on odd Street Cred: lock holds, no draw", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
      { field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true }] },
    );
    const handBefore = engine.getHandCount(P1);

    engine.playCard(relapse, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailCorpoSecurity, { as: P1 });

    expect(engine.getHandCount(P1)).toBe(handBefore - 1);
    expect(engine.getCard(welcomeToNightCityRetailCorpoSecurity, "field", P2).meta.spent).toBe(
      true,
    );
  });

  it("still draws on even Street Cred when the rival has no Units at all", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [relapse],
        deck: [welcomeToNightCityRetailFieldOperator],
        eddies: 3,
        gigArea: [{ dieType: "d6", faceValue: 2 }],
      },
      {},
      { preserveDeckOrder: true },
    );

    const result = engine.playCard(relapse, { as: P1 });

    expect(engine.getState().G.turnMetadata.pendingChoice).toBeUndefined();
    expect(result.moveLogs).toContainEqual(
      expect.objectContaining({
        type: "action",
        messageKey: "trigger.requiredTargetUnavailable",
        params: { cardName: "Memory Relapse", targetDescription: "rival Unit" },
      }),
    );
    const targetLog = engine
      .getEvents("actionLog")
      .find((event) => event.messageKey === "trigger.requiredTargetUnavailable");
    expect(targetLog && formatActionLog(targetLog, enMessages)).toBe(
      "Memory Relapse had no legal rival Unit; target-dependent effects were skipped.",
    );
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    expect(engine.getCard(relapse, "trash", P1)).toBeDefined();
  });
});
