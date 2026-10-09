import { describe } from "vitest";
import { eternalDirective } from "./eternal-directive.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers WRDbeFfnar-a1 */
describe("Eternal Directive — Command", () => {
  proveCommandAttack({ card: eternalDirective, automaton: true });
});
