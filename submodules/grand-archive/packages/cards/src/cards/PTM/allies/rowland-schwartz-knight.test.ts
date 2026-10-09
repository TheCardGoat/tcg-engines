import { describe } from "vitest";
import { rowlandSchwartzKnight } from "./rowland-schwartz-knight.ts";

import { proveCommandedWill } from "../../../testing/commanded-will.ts";
/** @covers bGmutHfgMl-a1 */
describe("rowlandSchwartzKnight — Commanded Will", () => {
  proveCommandedWill(rowlandSchwartzKnight, 1);
});
