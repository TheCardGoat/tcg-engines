import { describe, test } from "vite-plus/test";
import { op01PunkGibson058 } from "../../../../../cards/src/cards/events/op01-058-punk-gibson.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-058 Punk Gibson", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01PunkGibson058);
  });
});
