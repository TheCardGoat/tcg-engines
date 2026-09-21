import { describe, test } from "vite-plus/test";
import { op08PhoenixBrand055 } from "../../../../../cards/src/cards/events/op08-055-phoenix-brand.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-055 Phoenix Brand", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08PhoenixBrand055);
  });
});
