import { describe, test } from "vite-plus/test";
import { eb02Franky037 } from "../../../../../cards/src/cards/EB02/characters/037-franky.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-037 Franky", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Franky037);
  });
});
