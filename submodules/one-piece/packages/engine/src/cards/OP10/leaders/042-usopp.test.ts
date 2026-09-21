import { describe, test } from "vite-plus/test";
import { op10Usopp042 } from "../../../../../cards/src/cards/leaders/op10-042-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-042 Usopp", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10Usopp042);
  });
});
