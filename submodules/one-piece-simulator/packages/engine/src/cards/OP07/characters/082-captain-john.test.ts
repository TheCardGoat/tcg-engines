import { describe, test } from "vite-plus/test";
import { op07CaptainJohn082 } from "../../../../../cards/src/cards/OP07/characters/082-captain-john.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-082 Captain John", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07CaptainJohn082);
  });
});
