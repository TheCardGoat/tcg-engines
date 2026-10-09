import { describe } from "vitest";
import { bishopsCross } from "./bishops-cross.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers lsKJCCuFJV-a1 */
describe("Bishop's Cross — Command", () => {
  proveCommandAttack({ card: bishopsCross });
});
