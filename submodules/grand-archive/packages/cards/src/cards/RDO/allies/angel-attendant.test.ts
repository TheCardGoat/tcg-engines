import { describe } from "vitest";

import { proveImbueKeyword } from "../../../testing/imbue-keyword.ts";
import { angelAttendant } from "./angel-attendant.ts";

/** @covers 92mnQJPfR8-a1 */
describe("Angel Attendant — Imbue keyword", () => {
  proveImbueKeyword({
    card: angelAttendant,
    cost: { kind: "reserve", amount: 2 },
    threshold: 1,
    requirement: "advanced",
  });
});

import { proveDeathDraw } from "../../../testing/death-draw.ts";
import { ferventBeastmaster } from "../../DOA/allies/fervent-beastmaster.ts";
/** @covers 92mnQJPfR8-a3 */
describe("angelAttendant death draw", () =>
  proveDeathDraw({
    card: angelAttendant,
    abilityId: "92mnQJPfR8-a3",
    attacker: ferventBeastmaster,
  }));
