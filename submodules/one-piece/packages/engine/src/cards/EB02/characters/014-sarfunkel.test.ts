import { describe, test } from "vite-plus/test";
import { eb02Sarfunkel014 } from "../../../../../cards/src/cards/EB02/characters/014-sarfunkel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-014 Sarfunkel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Sarfunkel014);
  });
});
