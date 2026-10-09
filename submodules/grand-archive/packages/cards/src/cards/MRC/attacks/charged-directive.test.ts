import { describe } from "vitest";
import { chargedDirective } from "./charged-directive.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers L2smMJ3Ucb-a1 */
describe("Charged Directive — Command", () => {
  proveCommandAttack({ card: chargedDirective, automaton: true });
});
