import { describe, test } from "vite-plus/test";
import { op11YouReJustNotMyType115 } from "../../../../../cards/src/cards/OP11/events/115-you-re-just-not-my-type.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-115 You're Just Not My Type!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11YouReJustNotMyType115);
  });
});
