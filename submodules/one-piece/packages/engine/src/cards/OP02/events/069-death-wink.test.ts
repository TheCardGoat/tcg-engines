import { describe, test } from "vite-plus/test";
import { op02DeathWink069 } from "../../../../../cards/src/cards/OP02/events/069-death-wink.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-069 DEATH WINK", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02DeathWink069);
  });
});
