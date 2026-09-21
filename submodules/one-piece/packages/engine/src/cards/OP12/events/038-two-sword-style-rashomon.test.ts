import { describe, test } from "vite-plus/test";
import { op12TwoSwordStyleRashomon038 } from "../../../../../cards/src/cards/events/op12-038-two-sword-style-rashomon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-038 Two-Sword Style Rashomon", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12TwoSwordStyleRashomon038);
  });
});
