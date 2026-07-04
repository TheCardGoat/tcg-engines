import { describe, test } from "vite-plus/test";
import { eb02Blueno047 } from "../../../../../cards/src/cards/EB02/characters/047-blueno.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-047 Blueno", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Blueno047);
  });
});
