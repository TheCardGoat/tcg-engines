import { describe, test } from "vite-plus/test";
import { op14eb04OceanCurrentShoulderThrow058 } from "../../../../../cards/src/cards/OP14EB04/events/058-ocean-current-shoulder-throw.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-058 Ocean Current Shoulder Throw", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04OceanCurrentShoulderThrow058);
  });
});
