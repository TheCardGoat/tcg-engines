import { describe, expect, it } from "vite-plus/test";
import type { PreventGigStealPendingChoice } from "../../../types/match-state.ts";
import {
  welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
  welcomeToNightCityRetailBonnieAndClyde,
  welcomeToNightCityRetailDelamainCab,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

describe("Alt Cunningham — Mother of Daemons", () => {
  it("prevents a gig theft by discarding a card whose cost equals the Gig's value", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
            spent: false,
            hasLag: false,
          },
        ],
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    // P1's Delamain Cab attacks P2 directly and would steal the d6 (value 3).
    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });

    const choice = engine.getState().G.turnMetadata.pendingChoice as
      | PreventGigStealPendingChoice
      | undefined;
    expect(choice?.type).toBe("preventGigSteal");
    expect(choice?.payload.stealEntries[0]?.value).toBe(3);

    const dieId = choice!.payload.stealEntries[0]!.dieId as string;
    const cardId = choice!.payload.handEntries.find((entry) => entry.cost === 3)!.cardId as string;

    // P2 discards Bonnie and Clyde (cost 3) to keep the value-3 Gig.
    engine.resolvePreventGigSteal([{ dieId, cardId }], { as: P2 });

    expect(engine.getGigDice(P2).map((die) => die.dieType)).toContain("d6");
    expect(engine.getCardsInZone("trash", P2).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailBonnieAndClyde.id,
    );
    expect(engine.getEvents("gigStolen")).toHaveLength(0);
  });

  it("lets the theft resolve when prevention is declined", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: welcomeToNightCityRetailDelamainCab, spent: false, hasLag: false }],
        eddies: 4,
      },
      {
        field: [
          {
            card: welcomeToNightCityRetailAltCunninghamMotherOfDaemons,
            spent: false,
            hasLag: false,
          },
        ],
        hand: [welcomeToNightCityRetailBonnieAndClyde],
        gigArea: [{ dieType: "d6", faceValue: 3 }],
      },
    );

    engine.attackRival(welcomeToNightCityRetailDelamainCab, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.declinePreventGigSteal({ as: P2 });

    expect(engine.getEvents("gigStolen")).toHaveLength(1);
    expect(engine.getGigDice(P1).map((die) => die.dieType)).toContain("d6");
  });
});
