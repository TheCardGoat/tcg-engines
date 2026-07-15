import { describe, test } from "vite-plus/test";
import { op06YouAinTEvenWorthKillingTime039 } from "../../../../../cards/src/cards/OP06/events/039-you-ain-t-even-worth-killing-time.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-039 You Ain't Even Worth Killing Time!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06YouAinTEvenWorthKillingTime039);
  });
});
