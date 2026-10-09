import { describe } from "vitest";
import { packageCourier } from "./package-courier.ts";
import { proveOptionalLoot } from "../../../testing/optional-loot.ts";
/** @covers kjCKx4FVrM-a1 */
describe("packageCourier optional entry discard", () =>
  proveOptionalLoot({
    card: packageCourier,
    abilityId: "kjCKx4FVrM-a1",
    onAttack: false,
    cost: 2,
    buff: false,
  }));
