import { describe, test } from "vite-plus/test";
import { op01PunkGibson058 } from "../../../../../cards/src/cards/OP01/events/058-punk-gibson.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-058 Punk Gibson", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01PunkGibson058);
  });
});
