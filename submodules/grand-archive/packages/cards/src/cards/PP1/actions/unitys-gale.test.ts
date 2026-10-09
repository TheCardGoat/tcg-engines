import { describe } from "vitest";
import { unitysGale } from "./unitys-gale.ts";
import { proveTargetedAllyStat } from "../../../testing/targeted-ally-stat.ts";
/** @covers uUWsgLmyTk-a1 */

describe("unitysGale — temporary ally bonus", () => {
  proveTargetedAllyStat({
    card: unitysGale,
    property: "life",
    bonus: 3,
    targets: "one",
    human: false,
    extraCost: 0,
  });
});
