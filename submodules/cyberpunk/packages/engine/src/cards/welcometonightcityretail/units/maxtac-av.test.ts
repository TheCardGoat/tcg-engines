import { describe, expect, it } from "vite-plus/test";
import { welcomeToNightCityRetailMaxtacAv } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const av = welcomeToNightCityRetailMaxtacAv;

describe("MaxTac AV", () => {
  it("is a green NCPD/Vehicle unit", () => {
    expect(av).toMatchObject({
      type: "unit",
      color: "green",
      classifications: ["NCPD", "Vehicle"],
      cost: 5,
      power: 8,
      printNumber: "080",
    });
  });

  it("on Play may swap a friendly Gig with a rival Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [av],
        eddies: 5,
        gigArea: [{ dieType: "d4", faceValue: 2 }],
      },
      {
        gigArea: [{ dieType: "d8", faceValue: 6 }],
      },
    );
    const friendly = engine.findGigIdByType(P1, "d4");
    const rival = engine.findGigIdByType(P2, "d8");

    engine.playCard(av, { as: P1 });
    const first = engine.getState().G.turnMetadata.pendingChoice;
    if (first?.type === "chooseTarget") {
      engine.resolveEffectTargetIds([friendly], {
        as: P1,
        allowPendingChoice: true,
        reason: "MaxTac AV still needs the rival Gig",
      });
      engine.resolveEffectTargetIds([rival], { as: P1 });
    }

    expect(engine.getGigDice(P1).map((die) => die.id)).toContain(rival);
    expect(engine.getGigDice(P2).map((die) => die.id)).toContain(friendly);
  });

  it("enters the field even when there is no rival Gig to swap", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [av],
      eddies: 5,
      gigArea: [{ dieType: "d4", faceValue: 2 }],
    });

    engine.playCard(av, { as: P1 });
    expect(engine.getCardsInZone("field", P1).map((card) => card.definitionId)).toContain(av.id);
  });
});
