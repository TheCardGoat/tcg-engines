import { describe, test } from "vite-plus/test";
import { eb01MiniMerry011 } from "../../../../../cards/src/cards/stages/eb01-011-mini-merry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-011 Mini-Merry", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01MiniMerry011);
  });
});
