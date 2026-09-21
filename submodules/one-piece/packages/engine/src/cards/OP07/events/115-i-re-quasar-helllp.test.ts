import { describe, test } from "vite-plus/test";
import { op07IReQuasarHelllp115 } from "../../../../../cards/src/cards/events/op07-115-i-re-quasar-helllp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-115 I Re-Quasar Helllp!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07IReQuasarHelllp115);
  });
});
