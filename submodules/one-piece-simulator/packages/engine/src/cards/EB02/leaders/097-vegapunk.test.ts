import { describe, test } from "vite-plus/test";
import { eb02Vegapunk097 } from "../../../../../cards/src/cards/EB02/leaders/097-vegapunk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-097 Vegapunk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Vegapunk097);
  });
});
