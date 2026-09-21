import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailDelamainCab,
  welcomeToNightCityRetailRidingNomad,
  welcomeToNightCityRetailWildInTheStreets,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Delamain Cab", () => {
  it("is an exact 4-cost 4-power blue Vehicle with RAM 2 and an end-of-your-turn history check", () => {
    expect(welcomeToNightCityRetailDelamainCab).toMatchObject({
      type: "unit",
      color: "blue",
      classifications: ["Vehicle"],
      cost: 4,
      power: 4,
      ram: 2,
      hasSellTag: false,
    });
    expect(welcomeToNightCityRetailDelamainCab.abilities).toEqual([
      {
        kind: "triggered",
        text: "At the end of your turn, if this Unit stole a Gig this turn, ready 1 Eddie.",
        trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
        source: { selector: "self" },
        effects: [
          {
            effect: "readyEddies",
            player: "friendly",
            amount: 1,
            conditions: [
              {
                condition: "hasStolenGigThisTurn",
                target: { selector: "self" },
              },
            ],
          },
        ],
      },
    ]);
  });

  it("readies 1 Eddie at end of turn after stealing a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: welcomeToNightCityRetailDelamainCab,
            spent: false,
            hasLag: false,
          },
        ],
        eddies: 4,
      },
      {
        gigArea: [{ dieType: "d6", faceValue: 4 }],
      },
    );
    engine.getState().G.players[P1]!.eddies = 2;
    engine.getState().G.players[P1]!.spentEddies = 2;

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");
    expect(engine.getEddies(P1)).toBe(2);

    engine.completeTurn({ as: P1 });

    expect(engine.getEddies(P1)).toBe(3);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(1);
  });

  it("does not ready an Eddie when it did not steal a Gig this turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      field: [
        {
          card: welcomeToNightCityRetailDelamainCab,
          spent: false,
          hasLag: false,
        },
      ],
      eddies: 4,
    });
    engine.getState().G.players[P1]!.eddies = 3;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.completeTurn({ as: P1 });

    expect(engine.getEddies(P1)).toBe(3);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(1);
  });

  it("does not trigger when another friendly Unit stole the Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailRidingNomad, spent: false, hasLag: false },
        ],
        eddies: 4,
      },
      { gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );
    engine.getState().G.players[P1]!.eddies = 3;
    engine.getState().G.players[P1]!.spentEddies = 1;

    engine.attackRival(welcomeToNightCityRetailRidingNomad, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.completeTurn({ as: P1 });

    expect(engine.getEddies(P1)).toBe(3);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(1);
  });

  it("does not trigger if it stole a Gig but left play before the end of turn", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [welcomeToNightCityRetailWildInTheStreets],
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        eddies: 5,
      },
      { gigArea: [{ dieType: "d6", faceValue: 4 }] },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.playCard(welcomeToNightCityRetailWildInTheStreets, { as: P1 });
    engine.resolveEffectTarget(welcomeToNightCityRetailDelamainCab, { as: P1 });
    expect(engine.getCardsInZone("trash", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailDelamainCab.id,
    );

    engine.completeTurn({ as: P1 });

    expect(engine.getEddies(P1)).toBe(0);
    expect(engine.getState().G.players[P1]!.spentEddies).toBe(5);
  });
});
