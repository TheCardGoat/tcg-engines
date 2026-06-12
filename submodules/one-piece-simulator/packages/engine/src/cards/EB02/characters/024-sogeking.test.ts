import { describe, test } from "vite-plus/test";
import { eb02Sogeking024 } from "../../../../../cards/src/cards/EB02/characters/024-sogeking.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-024 Sogeking", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Sogeking024);
  });
});
