import { describe, test } from "vite-plus/test";
import { eb02Sabo002 } from "../../../../../cards/src/cards/characters/eb02-002-sabo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-002 Sabo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Sabo002);
  });
});
