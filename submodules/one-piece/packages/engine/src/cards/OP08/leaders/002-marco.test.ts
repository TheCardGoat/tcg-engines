import { describe, test } from "vite-plus/test";
import { op08Marco002 } from "../../../../../cards/src/cards/leaders/op08-002-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-002 Marco", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Marco002);
  });
});
