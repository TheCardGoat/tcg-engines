import { describe } from "vitest";
import { maidenOfShroudedFog } from "./maiden-of-shrouded-fog.ts";

import { proveClassSpellshroudObject } from "../../../testing/class-spellshroud-object.ts";
/** @covers wum3f33kay-a1 */
describe("maidenOfShroudedFog Class Bonus Spellshroud", () =>
  proveClassSpellshroudObject(maidenOfShroudedFog));
