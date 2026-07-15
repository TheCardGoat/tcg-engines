import { describe, test } from "vite-plus/test";
import { eb02Sengoku044 } from "../../../../../cards/src/cards/EB02/characters/044-sengoku.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-044 Sengoku", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Sengoku044);
  });
});
