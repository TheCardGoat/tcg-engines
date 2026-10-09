import { describe } from "vitest";
import { windfallCheck } from "./windfall-check.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers e1jCu0neWY-a1 */
describe("Windfall Check — Command", () => {
  proveCommandAttack({ card: windfallCheck });
});
