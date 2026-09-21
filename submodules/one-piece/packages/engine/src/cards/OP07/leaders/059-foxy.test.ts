import { describe, test } from "vite-plus/test";
import { op07Foxy059 } from "../../../../../cards/src/cards/leaders/op07-059-foxy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-059 Foxy", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Foxy059);
  });
});
