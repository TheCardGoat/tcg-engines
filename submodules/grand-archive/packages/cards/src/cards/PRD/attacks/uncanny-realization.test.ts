import { describe } from "vitest";
import { uncannyRealization } from "./uncanny-realization.ts";

import { proveCommandAttack } from "../../../testing/command-attack.ts";
/** @covers Nr5GpfLNrh-a1 */
describe("Uncanny Realization — Command", () => {
  proveCommandAttack({ card: uncannyRealization, automaton: true });
});
