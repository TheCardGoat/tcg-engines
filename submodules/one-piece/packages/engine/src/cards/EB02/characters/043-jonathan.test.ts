import { describe, test } from "vite-plus/test";
import { eb02Jonathan043 } from "../../../../../cards/src/cards/characters/eb02-043-jonathan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-043 Jonathan", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Jonathan043);
  });
});
