import { describe, expect, it } from "vitest";
import { fleshAndBloodStructuredCardsByCanonicalId } from "./index.ts";
import { nimblismBlue, nimblismRed, nimblismYellow } from "./cards/actions/nimblism.ts";
import { snatchBlue, snatchRed, snatchYellow } from "./cards/actions/snatch.ts";
import { cripplingCrushRed } from "./cards/actions/crippling-crush.ts";

function assertLaunchObservables(): void {
  const red = fleshAndBloodStructuredCardsByCanonicalId.get(nimblismRed.canonicalId);
  const yellow = fleshAndBloodStructuredCardsByCanonicalId.get(nimblismYellow.canonicalId);
  const blue = fleshAndBloodStructuredCardsByCanonicalId.get(nimblismBlue.canonicalId);
  const snatch = fleshAndBloodStructuredCardsByCanonicalId.get(snatchRed.canonicalId);
  const crush = fleshAndBloodStructuredCardsByCanonicalId.get(cripplingCrushRed.canonicalId);
  expect(red?.base.numeric.pitch).toBe(1);
  expect(red?.base.color).toBe("red");
  expect(yellow?.base.numeric.pitch).toBe(2);
  expect(yellow?.base.color).toBe("yellow");
  expect(blue?.base.numeric.pitch).toBe(3);
  expect(blue?.base.color).toBe("blue");
  expect(snatch?.base.numeric.pitch).toBe(1);
  expect(snatch?.base.color).toBe("red");
  expect(
    fleshAndBloodStructuredCardsByCanonicalId.get(snatchYellow.canonicalId)?.base.numeric.pitch,
  ).toBe(2);
  expect(
    fleshAndBloodStructuredCardsByCanonicalId.get(snatchBlue.canonicalId)?.base.numeric.pitch,
  ).toBe(3);
  expect(crush?.base.keywords?.some((keyword) => keyword.name === "crush")).toBe(true);
  const crushAbility = crush?.base.abilities?.find((ability) => ability.label?.name === "crush");
  expect(crushAbility).toMatchObject({
    kind: "static",
    staticKind: "triggered",
  });
  const dump = JSON.stringify([red, yellow, blue, snatch, crush]);
  expect(dump).not.toMatch(/activated-a-weapon-this-turn|3-or-more-created-this-way|in-your-party/);
}

describe("library launch of shipped cards entry", () => {
  it("run 1: Nimblism RGB and Crippling Crush observables", () => {
    assertLaunchObservables();
  });

  it("run 2: same observables from a second import path", () => {
    assertLaunchObservables();
  });
});
