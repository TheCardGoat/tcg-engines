import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailFieldOperator,
  welcomeToNightCityRetailMaelstromZealots,
  welcomeToNightCityRetailMantisBlades,
  welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
  welcomeToNightCityRetailSecondhandBombus,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../testing/index.ts";

describe("Maelstrom Zealots", () => {
  it("is the exact green 4-cost zero-power Ganger/Maelstrom with four loss orientations", () => {
    expect(welcomeToNightCityRetailMaelstromZealots).toMatchObject({
      type: "unit",
      color: "green",
      classifications: ["Ganger", "Maelstrom"],
      printNumber: "079",
      cost: 4,
      power: 0,
      ram: 1,
      hasSellTag: false,
      reminderText: ["Units with power 0 don't steal Gigs."],
    });
    expect(welcomeToNightCityRetailMaelstromZealots.abilities).toHaveLength(4);
    expect(
      welcomeToNightCityRetailMaelstromZealots.abilities.map((ability) => ability.trigger),
    ).toEqual([
      expect.objectContaining({
        event: expect.objectContaining({
          event: "fightResolved",
          result: "defenderWins",
          attacker: { selector: "self" },
        }),
      }),
      expect.objectContaining({
        event: expect.objectContaining({
          event: "fightResolved",
          result: "attackerWins",
          defender: { selector: "self" },
        }),
      }),
      expect.objectContaining({
        event: expect.objectContaining({
          event: "fightResolved",
          result: "mutual",
          attacker: { selector: "self" },
        }),
      }),
      expect.objectContaining({
        event: expect.objectContaining({
          event: "fightResolved",
          result: "mutual",
          defender: { selector: "self" },
        }),
      }),
    ]);
  });

  it("defeats the opposing rival Unit when it loses a fight as the attacker", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false }],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      {
        field: [{ card: welcomeToNightCityRetailCorpoSecurity, spent: true, hasLag: false }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailMaelstromZealots,
      welcomeToNightCityRetailCorpoSecurity,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    // CR 9.18: the loss trigger defeats Corpo Security first. CR 9.19 then
    // applies the stored fight result to Zealots.
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaelstromZealots.id,
    );
  });

  it("waits for River Ward's scry before applying its own fight-result defeat", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false }],
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailFieldOperator,
            spent: true,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailMantisBlades],
          },
        ],
        legendArea: [
          {
            card: welcomeToNightCityRetailRiverWardDetectiveOnTheHunt,
            faceDown: false,
            spent: false,
          },
        ],
        deck: [welcomeToNightCityRetailCorpoSecurity, welcomeToNightCityRetailCorpoSecurity],
      },
      { preserveDeckOrder: true },
    );

    engine.attackUnit(
      welcomeToNightCityRetailMaelstromZealots,
      welcomeToNightCityRetailFieldOperator,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    const scryChoice = engine.getState().G.turnMetadata.pendingChoice;
    if (!scryChoice || scryChoice.type !== "scry") throw new Error("Expected River Ward's scry");
    expect(engine.getAttackState()?.step).toBe("fightResult");
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaelstromZealots.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
    engine.resolveScryTo("trash", [scryChoice.payload.revealedCardIds[0]!], { as: P2 });
    engine.resolveFullFight({ as: P1 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaelstromZealots.id,
    );
  });

  it("defeats the opposing attacker when it loses a fight as the defender", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: true, hasLag: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailFieldOperator, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailFieldOperator,
      welcomeToNightCityRetailMaelstromZealots,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaelstromZealots.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailFieldOperator.id,
    );
  });

  it("defeats the opposing defender after both zero-power Units lose a mutual fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailSecondhandBombus, spent: true, hasLag: false }],
      },
    );

    engine.attackUnit(
      welcomeToNightCityRetailMaelstromZealots,
      welcomeToNightCityRetailSecondhandBombus,
      { as: P1 },
    );
    engine.resolveFullFight({ as: P1 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaelstromZealots.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSecondhandBombus.id,
    );
  });

  it("defeats the opposing attacker after both zero-power Units lose a mutual fight", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: true, hasLag: false }],
      },
      {
        field: [{ card: welcomeToNightCityRetailSecondhandBombus, spent: false, hasLag: false }],
      },
    );

    engine.judgeSetTurnMetadata({ activePlayerId: P2 }, { as: P1 });
    engine.attackUnit(
      welcomeToNightCityRetailSecondhandBombus,
      welcomeToNightCityRetailMaelstromZealots,
      { as: P2 },
    );
    engine.resolveFullFight({ as: P2 });

    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailMaelstromZealots.id,
    );
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailSecondhandBombus.id,
    );
  });

  it("steals no Gig on a direct attack because its power is zero", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailMaelstromZealots, spent: false, hasLag: false }],
      },
      { gigArea: [{ dieType: "d4", faceValue: 1 }] },
    );

    engine.attackRival(welcomeToNightCityRetailMaelstromZealots, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getGigCount(P1)).toBe(0);
    expect(engine.getGigCount(P2)).toBe(1);
    engine.expectNoPendingChoice();
  });
});
