import { describe, test } from "vite-plus/test";
import { eb01JustShutUpAndComeWithUs009 } from "../../../../../cards/src/cards/EB01/events/009-just-shut-up-and-come-with-us.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-009 Just Shut Up and Come with Us!!!!", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01JustShutUpAndComeWithUs009);
  });
});
