import { describe, test } from "vite-plus/test";
import { eb02Hope031 } from "../../../../../cards/src/cards/events/eb02-031-hope.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-031 Hope", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Hope031);
  });
});
