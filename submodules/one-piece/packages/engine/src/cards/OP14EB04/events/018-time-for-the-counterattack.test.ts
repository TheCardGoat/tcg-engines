import { describe, test } from "vite-plus/test";
import { op14eb04TimeForTheCounterattack018 } from "../../../../../cards/src/cards/events/op14-018-time-for-the-counterattack.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP14-018 Time for the Counterattack", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op14eb04TimeForTheCounterattack018);
  });
});
