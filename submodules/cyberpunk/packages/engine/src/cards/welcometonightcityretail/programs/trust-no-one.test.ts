import { describe, expect, it } from "vite-plus/test";
import {
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailTrustNoOne,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../../testing/index.ts";
import type { PlayerId } from "../../../types/branded.ts";

const trustNoOne = welcomeToNightCityRetailTrustNoOne;

function selectGig(
  engine: CyberpunkTestEngine,
  owner: PlayerId,
  dieType: "d4" | "d6" | "d8" | "d10" | "d12",
): void {
  engine.resolveEffectTargetIds([engine.findGigIdByType(owner, dieType)], {
    as: P1,
    allowPendingChoice: true,
    reason: "the selected Gig is followed by the up-to-three value choice",
  });
}

describe("Trust No One", () => {
  it("has the exact blue Braindance identity and ordered optional-decrease/draw DSL", () => {
    expect(trustNoOne).toMatchObject({
      canonicalId: "trust-no-one",
      slug: "trust-no-one",
      name: "Trust No One",
      displayName: "Trust No One",
      type: "program",
      color: "blue",
      classifications: ["Braindance"],
      cost: 1,
      power: null,
      ram: 1,
      hasSellTag: true,
      rarity: "Common",
      printNumber: "139",
      timingTriggers: ["play"],
      reminderText: ["Discard programs after they resolve."],
      rulesText: "Decrease a Gig by up to 3. Then, if you control a min Gig, draw 1.",
      abilities: [
        {
          kind: "triggered",
          trigger: { trigger: "play" },
          source: { selector: "self" },
          bindings: [
            {
              id: "selectedGig",
              target: { selector: "gig", amount: 1, selection: { mode: "choose", min: 0, max: 1 } },
            },
          ],
          effects: [
            {
              effect: "adjustGig",
              target: { selector: "bound", id: "selectedGig" },
              maxAmount: 3,
              direction: "decrease",
              chooseUpTo: true,
            },
            {
              effect: "draw",
              player: "friendly",
              amount: 1,
              conditions: [{ condition: "hasMinGig", controller: "friendly" }],
            },
          ],
        },
      ],
    });
  });

  it("pays exactly 1 and rejects zero before creating a Gig choice", () => {
    const success = CyberpunkTestEngine.createWithFixture({
      hand: [trustNoOne],
      eddies: 1,
      gigArea: [{ dieType: "d6", faceValue: 3 }],
    });
    for (const legend of success.getCardsInZone("legendArea", P1))
      success.judgeSpendCard(legend, { as: P1 });
    success.playCard(trustNoOne, { as: P1 });
    expect(success.getEddies(P1)).toBe(0);
    expect(success.getState().G.turnMetadata.pendingChoice?.type).toBe("chooseTarget");

    const short = CyberpunkTestEngine.createWithFixture({ hand: [trustNoOne], eddies: 0 });
    for (const legend of short.getCardsInZone("legendArea", P1))
      short.judgeSpendCard(legend, { as: P1 });
    expect(short.expectFailure(() => short.playCard(trustNoOne, { as: P1 })).errorCode).toBe(
      "INSUFFICIENT_EDDIES",
    );
  });

  it("decreases a friendly Gig by exactly 3 to min, then draws 1", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [trustNoOne],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 4 }],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.playCard(trustNoOne, { as: P1 });
    selectGig(engine, P1, "d8");
    engine.resolveAdjustGig(1, { as: P1 });
    expect(engine.getGigDice(P1).find((gig) => gig.dieType === "d8")?.faceValue).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("may decrease a rival Gig, but does not draw when no friendly Gig is min", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [trustNoOne],
        eddies: 1,
        gigArea: [{ dieType: "d6", faceValue: 3 }],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      { gigArea: [{ dieType: "d8", faceValue: 4 }] },
      { preserveDeckOrder: true },
    );
    const handBefore = engine.getCardsInZone("hand", P1).length;
    engine.playCard(trustNoOne, { as: P1 });
    selectGig(engine, P2, "d8");
    engine.resolveAdjustGig(1, { as: P1 });
    expect(engine.getGigDice(P2).find((gig) => gig.dieType === "d8")?.faceValue).toBe(1);
    expect(engine.getCardsInZone("hand", P1)).toHaveLength(handBefore - 1);
  });

  it("may decline the Gig decrease and still draws for an existing friendly min Gig", () => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        hand: [trustNoOne],
        eddies: 1,
        gigArea: [{ dieType: "d4", faceValue: 1 }],
        deck: [welcomeToNightCityRetailCorpoSecurity],
      },
      {},
      { preserveDeckOrder: true },
    );
    engine.playCard(trustNoOne, { as: P1 });
    engine.declineAdjustGig({ as: P1 });
    engine.expectNoPendingChoice();
    expect(engine.getGigDice(P1)[0]?.faceValue).toBe(1);
    expect(engine.getCardsInZone("hand", P1).map((card) => card.definitionId)).toContain(
      welcomeToNightCityRetailCorpoSecurity.id,
    );
  });

  it("allows zero to three decrease, rejects a fourth step and any increase", () => {
    const createEngine = () =>
      CyberpunkTestEngine.createWithFixture({
        hand: [trustNoOne],
        eddies: 1,
        gigArea: [{ dieType: "d8", faceValue: 5 }],
      });
    const unchanged = createEngine();
    unchanged.playCard(trustNoOne, { as: P1 });
    selectGig(unchanged, P1, "d8");
    unchanged.resolveAdjustGig(5, { as: P1 });
    expect(unchanged.getGigDice(P1)[0]?.faceValue).toBe(5);
    expect(unchanged.getEvents("gigValueChanged")).toHaveLength(0);

    const excessive = createEngine();
    excessive.playCard(trustNoOne, { as: P1 });
    selectGig(excessive, P1, "d8");
    expect(excessive.expectFailure(() => excessive.resolveAdjustGig(1, { as: P1 })).errorCode).toBe(
      "EXCEEDS_MAX_AMOUNT",
    );

    const increase = createEngine();
    increase.playCard(trustNoOne, { as: P1 });
    selectGig(increase, P1, "d8");
    expect(increase.expectFailure(() => increase.resolveAdjustGig(6, { as: P1 })).errorCode).toBe(
      "WRONG_DIRECTION",
    );
    increase.resolveAdjustGig(2, { as: P1 });
    expect(increase.getGigDice(P1)[0]?.faceValue).toBe(2);
  });
});
