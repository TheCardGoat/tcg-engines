import { describe, test } from "vite-plus/test";
import { op12WeLlRingTheBellWaitingForYou116 } from "../../../../../cards/src/cards/OP12/events/116-we-ll-ring-the-bell-waiting-for-you.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-116 We'll Ring the Bell Waiting for You!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12WeLlRingTheBellWaitingForYou116);
  });
});
