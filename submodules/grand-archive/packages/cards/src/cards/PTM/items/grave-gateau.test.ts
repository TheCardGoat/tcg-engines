import { describe } from "vitest";
import { graveGateau } from "./grave-gateau.ts";
import { proveChampionEphemerate } from "../../../testing/champion-ephemerate.ts";
/** @covers FQigf17dCr-a1 @covers FQigf17dCr-a2 @covers FQigf17dCr-a3 */
describe("Grave Gateau", () => proveChampionEphemerate(graveGateau, "Alice", 1, "item"));
