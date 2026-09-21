import { describe, test } from "vite-plus/test";
import { op02DeathWink069 } from "../../../../../cards/src/cards/events/op02-069-death-wink.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-069 DEATH WINK", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02DeathWink069);
  });
});
