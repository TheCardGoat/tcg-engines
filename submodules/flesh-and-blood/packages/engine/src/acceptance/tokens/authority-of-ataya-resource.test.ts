/** SUP000 Authority of Ataya — opposing defense-reaction surcharge. */
import { describe, expect, it } from "vitest";
import { FabTestEngine } from "../../testing/test-engine.ts";
import { bravo, dash, nimbleStrikeRed, nimblismBlue, sinkBelow } from "../../rules/fixtures.ts";
import { authorityOfAtayaBlue } from "../../../../cards/src/cards/resources/authority-of-ataya.ts";

function resolvePendingPitchTrigger(game: ReturnType<typeof FabTestEngine.start>): void {
  for (let safety = 0; safety < 8; safety += 1) {
    if (game.getState().rulesStack.at(-1)?.kind !== "triggered") return;
    game.passBoth();
  }
}

describe("Authority of Ataya resource (SUP000)", () => {
  it("taxes an opposing defense reaction: zero resource rejects, one resource pays", () => {
    const taxed = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, authorityOfAtayaBlue], resourcePoints: 0, deck: 8 },
      { hero: dash, hand: [nimblismBlue, sinkBelow], resourcePoints: 0, deck: 8 },
      { autoPassPriority: false, autoPitch: false },
    );
    const TaxedBravo = taxed.as(bravo);
    const TaxedDash = taxed.as(dash);
    TaxedBravo.attackWith(nimbleStrikeRed, { pitch: [authorityOfAtayaBlue] });
    resolvePendingPitchTrigger(taxed);
    TaxedDash.defendWith(nimblismBlue);
    taxed.passBoth();
    expect(taxed.combat()?.step).toBe("reaction");
    TaxedBravo.pass();
    expect(() => TaxedDash.play(sinkBelow)).toThrow(/resource cost/i);

    const payable = FabTestEngine.start(
      { hero: bravo, hand: [nimbleStrikeRed, authorityOfAtayaBlue], resourcePoints: 0, deck: 8 },
      { hero: dash, hand: [nimblismBlue, sinkBelow], resourcePoints: 1, deck: 8 },
      { autoPassPriority: false, autoPitch: false },
    );
    const PayableBravo = payable.as(bravo);
    const PayableDash = payable.as(dash);
    PayableBravo.attackWith(nimbleStrikeRed, { pitch: [authorityOfAtayaBlue] });
    resolvePendingPitchTrigger(payable);
    PayableDash.defendWith(nimblismBlue);
    payable.passBoth();
    PayableBravo.pass();
    PayableDash.play(sinkBelow);
    expect(PayableDash.resourcePoints()).toBe(0);
    expect(payable.getState().rulesStack.at(-1)).toMatchObject({
      kind: "card",
      role: "defense-reaction",
    });
  });
});
