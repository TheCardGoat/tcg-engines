import { describe } from "vitest";
import { lycoria } from "./lycoria.ts";

import { provePhaseSelfDamage } from "../../../testing/phase-self-damage.ts";
/** @covers 89nl1vcn33-a1 */
describe("lycoria phase damage", () =>
  provePhaseSelfDamage(lycoria, "recollection", 1, true, false));
