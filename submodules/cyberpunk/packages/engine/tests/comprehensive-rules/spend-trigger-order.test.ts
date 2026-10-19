import { describe, expect, it } from "vite-plus/test";
import {
  theHeistRetailStarterDeckVCorporateExile,
  welcomeToNightCityRetailCorpoSecurity,
  welcomeToNightCityRetailDetonate,
  welcomeToNightCityRetailHeywoodRipperdoc,
  welcomeToNightCityRetailJackieWellesMamaSFavorite,
  welcomeToNightCityRetailPepeNajarroWorkingDoubles,
  welcomeToNightCityRetailVStreetkid,
  welcomeToNightCityRetailZetatechFaceplate,
} from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1, P2 } from "../../src/testing/index.ts";

const pepe = welcomeToNightCityRetailPepeNajarroWorkingDoubles;
const faceplate = welcomeToNightCityRetailZetatechFaceplate;
const ripperdoc = welcomeToNightCityRetailHeywoodRipperdoc;
const jackie = welcomeToNightCityRetailJackieWellesMamaSFavorite;
const v = welcomeToNightCityRetailVStreetkid;
const paymentLegend = theHeistRetailStarterDeckVCorporateExile;

function chooseTrigger(engine: CyberpunkTestEngine, sourceCardId: string): void {
  const choice = engine.getPrompt(P1).choice;
  if (choice?.type !== "chooseTrigger") throw new Error("Expected a trigger-order choice");
  const option = choice.payload.options.find((entry) => entry.sourceCardId === sourceCardId);
  if (!option) throw new Error("Expected the source's trigger to be selectable");
  expect(
    engine.executeMove("resolveTrigger", { args: { triggerId: option.triggerId } }, P1),
  ).toMatchObject({ success: true });
}

describe("Spend triggers alongside ATTACK and PLAY triggers", () => {
  // CR 11.21.2.1, 10.12, 10.3.3; Zetatech Faceplate FAQ
  // 9f87591e-514c-44ee-bba4-515fc488fb77.
  it.each([
    { order: ["Pepe", "A", "B"], readied: true, drawn: 2 },
    { order: ["Pepe", "B", "A"], readied: true, drawn: 1 },
    { order: ["A", "Pepe", "B"], readied: false, drawn: 2 },
    { order: ["A", "B", "Pepe"], readied: false, drawn: 2 },
    { order: ["B", "Pepe", "A"], readied: true, drawn: 1 },
    { order: ["B", "A", "Pepe"], readied: false, drawn: 1 },
  ])("Pepe with two Faceplates resolves in order $order", ({ order, readied, drawn }) => {
    const engine = CyberpunkTestEngine.createWithFixture(
      {
        field: [{ card: pepe, hasLag: false, attachedGears: [faceplate, faceplate] }],
        legendArea: [
          { card: jackie, faceDown: false },
          { card: v, faceDown: false },
        ],
        deck: [welcomeToNightCityRetailDetonate, welcomeToNightCityRetailCorpoSecurity],
        gigArea: [
          { dieType: "d4", faceValue: 2 },
          { dieType: "d6", faceValue: 2 },
          { dieType: "d8", faceValue: 4 },
        ],
      },
      { gigArea: [{ dieType: "d10", faceValue: 3 }] },
      { preserveDeckOrder: true },
    );
    engine.judgeSpendCard(jackie, { as: P1 });
    engine.judgeSpendCard(v, { as: P1 });
    const legends = [
      engine.findCardId(jackie, "legendArea", P1),
      engine.findCardId(v, "legendArea", P1),
    ];
    const host = engine.getCard(pepe, "field", P1);
    const [faceplateA, faceplateB] = host.meta.attachedGearIds;
    if (!faceplateA || !faceplateB) throw new Error("Expected two distinct Faceplates");
    expect(faceplateA).not.toBe(faceplateB);

    engine.attackRival(pepe, { as: P1 });
    const initial = engine.getPrompt(P1).choice;
    if (initial?.type !== "chooseTrigger") throw new Error("Expected all three pending effects");
    expect(initial.payload.options.map((entry) => entry.sourceCardId)).toEqual(
      expect.arrayContaining([host.instanceId, faceplateA, faceplateB]),
    );
    expect(initial.payload.options).toHaveLength(3);

    let expectedDraws = 0;
    for (const [index, step] of order.entries()) {
      // The final mandatory trigger starts automatically once it is the only one left.
      if (index < 2) {
        chooseTrigger(
          engine,
          step === "Pepe" ? host.instanceId : step === "A" ? faceplateA : faceplateB,
        );
      }
      if (step === "Pepe") {
        if (readied) {
          engine.resolveEffectTargetIds(legends, {
            as: P1,
            allowPendingChoice: true,
            reason: "The other Faceplate triggers still need to resolve",
          });
        }
        expect(engine.getCard(jackie, "legendArea", P1).meta.spent).toBe(!readied);
        expect(engine.getCard(v, "legendArea", P1).meta.spent).toBe(!readied);
      } else {
        engine.resolveAdjustGig(
          engine.findGigIdByType(P1, step === "A" ? "d6" : "d8"),
          step === "A" ? 3 : 5,
          { as: P1 },
        );
        if (new Set(engine.getGigDice(P1).map((gig) => gig.faceValue)).size === 3) expectedDraws++;
      }
      // A Faceplate's draw completes before another pending effect can be selected (CR 10.2.3).
      expect(engine.getHandCount(P1)).toBe(expectedDraws);
    }
    expect(engine.getHandCount(P1)).toBe(drawn);
    expect(engine.getGigDice(P1).map((gig) => gig.faceValue)).toEqual([2, 3, 5]);
    engine.expectNoPendingChoice();
    engine.resolveAttack({ as: P1 });
    expect(engine.getState().G.attackState?.step).toBe("react");
  });

  // General FAQ 3d7dd7c9-f7aa-4540-a1e7-fd65f2ea474d explicitly allows ordering
  // a Unit's PLAY trigger with a trigger from spending a Legend (CR 11.20.2, 10.12).
  for (const payment of ["automatic", "selected"] as const) {
    it.each([true, false])(
      `Ripperdoc and Faceplate allow spend-first=%s with ${payment} payment`,
      (spendFirst) => {
        const engine = CyberpunkTestEngine.createWithFixture(
          {
            hand: [ripperdoc],
            eddies: 5,
            legendArea: [{ card: paymentLegend, faceDown: false, attachedGears: [faceplate] }],
            deck: [welcomeToNightCityRetailDetonate],
            gigArea: [{ dieType: "d6", faceValue: 3 }],
          },
          {
            field: [{ card: welcomeToNightCityRetailCorpoSecurity, attachedGears: [faceplate] }],
          },
          { preserveDeckOrder: true },
        );
        const legendId = engine.findCardId(paymentLegend, "legendArea", P1);
        const ripperdocId = engine.findCardId(ripperdoc, "hand", P1);
        const [friendlyFaceplateId] = engine.getCard(paymentLegend, "legendArea", P1).meta
          .attachedGearIds;
        if (!friendlyFaceplateId) throw new Error("Expected the paying Legend's Faceplate");
        const rivalFaceplateId = engine.findCardId(faceplate, "field", P2);
        expect(
          engine.executeMove(
            "playCard",
            {
              args: {
                cardId: ripperdocId,
                ...(payment === "selected" ? { paymentSourceIds: [legendId] } : {}),
              },
            },
            P1,
          ),
        ).toMatchObject({ success: true });
        expect(engine.getCard(ripperdoc, "field", P1).meta.hasLag).toBe(true);
        expect(engine.getCard(paymentLegend, "legendArea", P1).meta.spent).toBe(true);
        expect(engine.getHandCount(P1)).toBe(0);
        const choice = engine.getPrompt(P1).choice;
        expect(choice?.type).toBe("chooseTrigger");
        if (choice?.type !== "chooseTrigger") throw new Error("Expected PLAY/spend ordering");
        expect(choice.payload.options.map((entry) => entry.sourceCardId)).toEqual(
          expect.arrayContaining([ripperdocId, friendlyFaceplateId]),
        );
        expect(choice.payload.options).toHaveLength(2);
        chooseTrigger(engine, spendFirst ? friendlyFaceplateId : ripperdocId);

        if (spendFirst) {
          engine.resolveAdjustGig(engine.findGigIdByType(P1, "d6"), 2, { as: P1 });
        }
        engine.resolveEffectTargetIds(
          [rivalFaceplateId],
          spendFirst
            ? { as: P1 }
            : {
                as: P1,
                allowPendingChoice: true,
                reason: "The payment Faceplate resolves after Ripperdoc",
              },
        );
        expect(engine.getCard(faceplate, "trash", P2)).toBeDefined();
        expect(engine.getHandCount(P1)).toBe(spendFirst ? 1 : 0);
        if (!spendFirst) {
          engine.resolveAdjustGig(engine.findGigIdByType(P1, "d6"), 2, { as: P1 });
          // Changing the Gig afterward cannot retroactively satisfy Ripperdoc's draw.
          expect(engine.getHandCount(P1)).toBe(0);
        }
        engine.expectNoPendingChoice();
      },
    );
  }
});
