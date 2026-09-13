import { describe, it } from "vite-plus/test";
import { expectRepairAbility } from "../../../test-helpers/keyword-behavior-test-helpers.ts";
import { st10SuperGundam004 } from "./004-super-gundam.ts";

describe("Super Gundam (ST10-004)", () => {
  it("<Repair 2> recovers exactly 2 HP at the end of its controller's turn", () => {
    expectRepairAbility(st10SuperGundam004, 2);
  });
});
