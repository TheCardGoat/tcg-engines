import { describe, test } from "vite-plus/test";
import { op14eb04OceanCurrentShoulderThrow058 } from "../../../../../cards/src/cards/events/op14-058-ocean-current-shoulder-throw.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-058 Ocean Current Shoulder Throw", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04OceanCurrentShoulderThrow058);
  });
});
