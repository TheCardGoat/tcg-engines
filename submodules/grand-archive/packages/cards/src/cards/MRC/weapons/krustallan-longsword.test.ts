import { describe } from "vitest";
import { krustallanLongsword } from "./krustallan-longsword.ts";
import { proveWaterGraveyardPower } from "../../../testing/water-graveyard-power.ts";
/** @covers cxwjbqjdmt-a1 */
describe("Krustallan Longsword — water graveyard power", () =>
  proveWaterGraveyardPower(krustallanLongsword, 4, 1, true));
