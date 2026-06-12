import { describe, test } from "vite-plus/test";
import { eb01MiniMerry011 } from "../../../../../cards/src/cards/EB01/stages/011-mini-merry.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-011 Mini-Merry", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01MiniMerry011);
  });
});
