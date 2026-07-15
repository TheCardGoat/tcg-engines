import { describe, test } from "vite-plus/test";
import { op12CaptainsAssembled097 } from "../../../../../cards/src/cards/OP12/events/097-captains-assembled.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-097 Captains Assembled", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12CaptainsAssembled097);
  });
});
