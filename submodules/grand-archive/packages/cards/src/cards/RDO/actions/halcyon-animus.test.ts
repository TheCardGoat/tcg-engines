import { describe } from "vitest";
import { halcyonAnimus } from "./halcyon-animus.ts";
import { proveEffectRegaliaMaterialization } from "../../../testing/effect-regalia-materialization.ts";
/** @covers uvopjFSUj0-a1 */
describe("Halcyon Animus — materialize regalia from material deck or banishment with its costs", () => {
  proveEffectRegaliaMaterialization(halcyonAnimus, true);
});
