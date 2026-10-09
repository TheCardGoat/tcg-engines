import { describe, expect, it } from "vite-plus/test";
import { createMockUnit } from "../testing/card-mocks.ts";
import { CyberpunkTestEngine, P1, P2 } from "../testing/test-engine.ts";
import { getProjectedDirectAttackGigStealCount } from "./resolve-attack.ts";

describe("direct attack Gig steal projection", () => {
  it("projects 1 Gig for a 5-power direct attack", () => {
    const attacker = createMockUnit({ id: "project-steal-5", power: 5 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d6", faceValue: 3 }] },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(1);
  });

  it("projects 2 Gigs for a 10-power direct attack", () => {
    const attacker = createMockUnit({ id: "project-steal-10", power: 10 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(2);
  });

  it("projects 0 Gigs for a 0-power direct attack", () => {
    const attacker = createMockUnit({ id: "project-steal-0", power: 0 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      { gigArea: [{ dieType: "d8", faceValue: 4 }] },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(0);
  });

  it("caps projected steals by rival Gigs", () => {
    const attacker = createMockUnit({ id: "project-steal-capped", power: 30 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 3 },
        ],
      },
    );

    engine.attackRival(attacker, { as: P1 });

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBe(2);
  });

  it("does not project a steal after a blocker redirects the direct attack", () => {
    const attacker = createMockUnit({ id: "project-steal-blocked", power: 10 });
    const blocker = createMockUnit({
      id: "project-steal-blocker",
      keywords: ["blocker"],
      power: 2,
    });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        field: [{ card: blocker, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(attacker, { as: P1 });
    engine.resolveAttack({ as: P1 });
    const block = engine.useBlocker(blocker, { as: P2 });

    expect(block.moveLogs).toContainEqual(
      expect.objectContaining({
        type: "action",
        messageKey: "move.useBlocker",
        params: expect.objectContaining({ blockerPower: 2, attackerPower: 10 }),
      }),
    );

    expect(getProjectedDirectAttackGigStealCount(engine.getState())).toBeNull();
  });
});

describe("fight result timing", () => {
  it("stores the determined result until the result step applies defeats", () => {
    const attacker = createMockUnit({ id: "fight-result-attacker", power: 3 });
    const defender = createMockUnit({ id: "fight-result-defender", power: 2 });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      { field: [{ card: defender, spent: true, hasLag: false }] },
    );

    engine.attackUnit(attacker, defender, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });

    expect(engine.getAttackState()).toMatchObject({
      step: "fightResult",
      fightResolution: { result: "attackerWins", attackerPower: 3, defenderPower: 2 },
    });
    expect(engine.getCardsInZone("field", P2)).toHaveLength(1);
    expect(engine.getCardsInZone("trash", P2)).toHaveLength(0);

    engine.resolveAttack({ as: P1 });
    expect(engine.getAttackState()).toBeNull();
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      defender.id,
    );
  });

  it("waits for a fight-loss choice before applying the stored defeat", () => {
    const attacker = createMockUnit({ id: "fight-choice-attacker", power: 3 });
    const defender = createMockUnit({
      id: "fight-choice-defender",
      power: 2,
      abilities: [
        {
          kind: "triggered",
          text: "When this Unit loses a fight, look at the top card of your deck and trash it.",
          trigger: {
            trigger: "event",
            event: {
              event: "fightResolved",
              player: "any",
              result: "attackerWins",
              defender: { selector: "self" },
            },
          },
          source: { selector: "self" },
          effects: [
            {
              effect: "scry",
              player: "friendly",
              amount: 1,
              destinations: [{ zone: "trash", min: 1, max: 1, reveal: false }],
            },
          ],
        },
      ],
    });
    const deckCard = createMockUnit({ id: "fight-choice-deck-card" });
    const engine = CyberpunkTestEngine.createWithFixture(
      { field: [{ card: attacker, spent: false, hasLag: false }] },
      {
        field: [{ card: defender, spent: true, hasLag: false }],
        deck: [deckCard],
      },
    );

    engine.attackUnit(attacker, defender, { as: P1 });
    engine.resolveAttack({ as: P1 });
    engine.resolveAttack({ as: P2, pass: true });
    engine.resolveAttack({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("scry");
    expect(engine.getAttackState()).toMatchObject({
      step: "fightResult",
      fightResolution: { result: "attackerWins" },
    });
    expect(engine.getCardsInZone("field", P2).map((card) => card.definitionId)).toContain(
      defender.id,
    );
    if (!choice || choice.type !== "scry") throw new Error("Expected fight-loss scry");
    engine.resolveScryTo("trash", [choice.payload.revealedCardIds[0]!], { as: P2 });
    engine.resolveAttack({ as: P1 });

    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      defender.id,
    );
  });
});
