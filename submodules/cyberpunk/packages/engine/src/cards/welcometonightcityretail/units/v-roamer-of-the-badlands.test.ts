import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailAnimalsWrecker,
  welcomeToNightCityRetailOverwatchPanamSGift,
  welcomeToNightCityRetailVRoamerOfTheBadlands,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";

const roamer = welcomeToNightCityRetailVRoamerOfTheBadlands;

function stealD10(): { engine: CyberpunkTestEngine; gigId: string } {
  const engine = CyberpunkTestEngine.createWithFixture(
    { field: [{ card: roamer, spent: false, hasLag: false }] },
    { gigArea: [{ dieType: "d10", faceValue: 2 }] },
  );
  const gigId = engine.findGigIdByType(P2, "d10");
  engine.attackRival(roamer, { as: P1 });
  engine.resolveFullSteal({ as: P1 });
  return { engine, gigId };
}

describe("V: Roamer of the Badlands", () => {
  it("has the exact red Merc/Nomad identity and both triggered-effect contracts", () => {
    expect(roamer).toMatchObject({
      canonicalId: "v-roamer-of-the-badlands",
      slug: "v-roamer-of-the-badlands",
      name: "V",
      subname: "Roamer of the Badlands",
      displayName: "V: Roamer of the Badlands",
      type: "unit",
      color: "red",
      classifications: ["Merc", "Nomad"],
      cost: 5,
      power: 6,
      ram: 2,
      hasSellTag: false,
      rarity: "Epic",
      printNumber: "020",
      rulesText:
        "When this Unit steals a Gig, increase it by up to 5.\nAt the end of your turn, if you control 2 or more Gigs with 8+ value, draw 1.",
      abilities: [
        {
          kind: "triggered",
          trigger: {
            trigger: "event",
            event: {
              event: "gigStolen",
              perGig: true,
              player: "friendly",
              target: { selector: "gig", controller: "rival", amount: 1 },
              minAmount: 1,
              source: { selector: "self" },
            },
          },
          source: { selector: "self" },
          effects: [
            {
              effect: "adjustGig",
              target: { selector: "context", key: "triggeredGigs" },
              maxAmount: 5,
              direction: "increase",
              chooseUpTo: true,
            },
          ],
        },
        {
          kind: "triggered",
          trigger: { trigger: "event", event: { event: "turnEnded", player: "friendly" } },
          source: { selector: "self" },
          effects: [
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
              conditions: [
                {
                  condition: "hasGigCount",
                  controller: "friendly",
                  minValue: 8,
                  comparison: "gte",
                  value: 2,
                },
              ],
            },
          ],
        },
      ],
    });
  });

  it("costs exactly 5, enters with Lag, and rejects one less", () => {
    const success = CyberpunkTestEngine.createWithFixture({ hand: [roamer], eddies: 5 });
    for (const legend of success.getCardsInZone("legendArea", P1)) {
      success.judgeSpendCard(legend, { as: P1 });
    }
    success.playCard(roamer, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getCard(roamer, "field", P1).meta.hasLag).toBe(true);

    const short = CyberpunkTestEngine.createWithFixture({ hand: [roamer], eddies: 4 });
    for (const legend of short.getCardsInZone("legendArea", P1)) {
      short.judgeSpendCard(legend, { as: P1 });
    }
    expect(short.expectFailure(() => short.playCard(roamer, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("increases the Gig it steals through the public attack flow", () => {
    const { engine, gigId } = stealD10();
    const choice = engine.getState().G.turnMetadata.pendingChoice;
    expect(choice?.type).toBe("chooseTarget");
    if (choice?.type === "chooseTarget") {
      expect(choice.payload).toMatchObject({ type: "adjustGig", dieId: gigId });
    }
    engine.resolveAdjustGig(7, { as: P1 });
    expect(engine.getGigDice(P1).find((gig) => gig.id === gigId)?.faceValue).toBe(7);
  });

  it("allows zero through five increase, but rejects a sixth step and any decrease", () => {
    const unchanged = stealD10();
    unchanged.engine.resolveAdjustGig(2, { as: P1 });
    expect(
      unchanged.engine.getGigDice(P1).find((gig) => gig.id === unchanged.gigId)?.faceValue,
    ).toBe(2);

    const excessive = stealD10();
    expect(
      excessive.engine.expectFailure(() => excessive.engine.resolveAdjustGig(8, { as: P1 }))
        .errorCode,
    ).toBe("EXCEEDS_MAX_AMOUNT");

    const decrease = stealD10();
    expect(
      decrease.engine.expectFailure(() => decrease.engine.resolveAdjustGig(1, { as: P1 }))
        .errorCode,
    ).toBe("WRONG_DIRECTION");
    decrease.engine.resolveAdjustGig(7, { as: P1 });
  });

  it("does not trigger when another friendly Unit steals a Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          { card: roamer, spent: false, hasLag: false },
          { card: welcomeToNightCityRetailAnimalsWrecker, spent: false, hasLag: false },
        ],
      },
      { gigArea: [{ dieType: "d8", faceValue: 2 }] },
    );
    engine.attackRival(welcomeToNightCityRetailAnimalsWrecker, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    engine.expectNoPendingChoice();
    expect(engine.getGigDice(P1).find((gig) => gig.dieType === "d8")?.faceValue).toBe(2);
  });

  it("pends one increase for each Gig this Unit steals at the same time", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [
          {
            card: roamer,
            spent: false,
            hasLag: false,
            attachedGears: [welcomeToNightCityRetailOverwatchPanamSGift],
          },
        ],
      },
      {
        gigArea: [
          { dieType: "d4", faceValue: 1 },
          { dieType: "d6", faceValue: 2 },
        ],
      },
    );
    engine.attackRival(roamer, { as: P1 });
    engine.resolveFullSteal({ as: P1 });
    expect(engine.getEvents("gigStolen")).toHaveLength(2);

    for (let resolved = 0; resolved < 2; resolved += 1) {
      const triggerChoice = engine.getState().G.turnMetadata.pendingChoice;
      if (triggerChoice?.type === "chooseTrigger") {
        const vTrigger = triggerChoice.payload.options.find(
          (option) => option.sourceCardId === engine.getCard(roamer, "field", P1).instanceId,
        );
        if (!vTrigger) throw new Error("Expected a pending V: Roamer trigger");
        engine.executeMove("resolveTrigger", { args: { triggerId: vTrigger.triggerId } }, P1);
      }
      const choice = engine.getState().G.turnMetadata.pendingChoice;
      expect(choice?.type).toBe("chooseTarget");
      if (!choice || choice.type !== "chooseTarget") throw new Error("Expected Gig adjustment");
      const dieId = (choice.payload.dieId ?? choice.payload.eligibleIds?.[0]) as string;
      const die = engine.getState().G.gigDice[dieId]!;
      engine.resolveAdjustGig(die.faceValue, { as: P1 });
    }
    engine.expectNoPendingChoice();
  });

  it("draws at end of its controller's turn with two 8+ Gigs", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      deck: [welcomeToNightCityRetailCorpoSecurity],
      field: [{ card: roamer, spent: false, hasLag: false }],
      gigArea: [
        { dieType: "d8", faceValue: 8 },
        { dieType: "d10", faceValue: 8 },
      ],
    });
    const handBefore = engine.getHandCount(P1);
    engine.completeTurn({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore + 1);
  });

  it("does not count a rival 8+ Gig toward the two-friendly-Gig threshold", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        deck: [welcomeToNightCityRetailCorpoSecurity],
        field: [{ card: roamer, spent: false, hasLag: false }],
        gigArea: [{ dieType: "d8", faceValue: 8 }],
      },
      { gigArea: [{ dieType: "d10", faceValue: 8 }] },
    );
    const handBefore = engine.getHandCount(P1);
    engine.completeTurn({ as: P1 });
    expect(engine.getHandCount(P1)).toBe(handBefore);
  });
});
