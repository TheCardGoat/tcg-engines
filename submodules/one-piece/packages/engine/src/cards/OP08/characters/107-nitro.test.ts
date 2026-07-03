import { describe, test } from "vite-plus/test";
import { op08Nitro107 } from "../../../../../cards/src/cards/OP08/characters/107-nitro.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-107 Nitro", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Nitro107);
  });
});
