import { describe, test } from "vite-plus/test";
import { op11LetSCrashThisWedding060 } from "../../../../../cards/src/cards/OP11/events/060-let-s-crash-this-wedding.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-060 Let's Crash This Wedding!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11LetSCrashThisWedding060);
  });
});
