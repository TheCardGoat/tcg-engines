import { describe, test } from "vite-plus/test";
import { op07Vegapunk097 } from "../../../../../cards/src/cards/OP07/leaders/097-vegapunk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-097 Vegapunk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Vegapunk097);
  });
});
