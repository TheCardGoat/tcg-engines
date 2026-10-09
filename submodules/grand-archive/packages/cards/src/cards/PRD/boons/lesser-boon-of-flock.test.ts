import { describe } from "vitest";
import { lesserBoonOfFlock } from "./lesser-boon-of-flock.ts";
import { proveSubtypeElementBoon } from "../../../testing/subtype-element-boon.ts";
import { trainedHawk } from "../../DOA/allies/trained-hawk.ts";
import { flamewingFowl } from "../../AMB/allies/flamewing-fowl.ts";
import { wingpeakPatriarch } from "../../HVN/allies/wingpeak-patriarch.ts";
import { felicitousFlock } from "../../HVN/allies/felicitous-flock.ts";
import { giantTortoise } from "../../DOA/allies/giant-tortoise.ts";
import { blitzMage } from "../../DOA/allies/blitz-mage.ts";
import { windriderMage } from "../../DOA/allies/windrider-mage.ts";
/** @covers 94rrVFUJG4-a1 @covers 94rrVFUJG4-a2 */
describe("lesserBoonOfFlock subtype element permission", () => {
  proveSubtypeElementBoon(
    lesserBoonOfFlock,
    [
      [trainedHawk, true],
      [flamewingFowl, true],
      [wingpeakPatriarch, true],
      [felicitousFlock, false],
      [giantTortoise, false],
      [blitzMage, false],
      [windriderMage, false],
    ],
    true,
  );
});
