import { describe, test } from "vite-plus/test";
import { op09ComeOnWeLlFightYou020 } from "../../../../../cards/src/cards/events/op09-020-come-on-we-ll-fight-you.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-020 Come On!! We'll Fight You!!", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09ComeOnWeLlFightYou020);
  });
});
