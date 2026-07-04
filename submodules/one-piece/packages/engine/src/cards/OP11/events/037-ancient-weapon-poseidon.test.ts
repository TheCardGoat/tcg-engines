import { describe, test } from "vite-plus/test";
import { op11AncientWeaponPoseidon037 } from "../../../../../cards/src/cards/OP11/events/037-ancient-weapon-poseidon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-037 Ancient Weapon Poseidon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11AncientWeaponPoseidon037);
  });
});
