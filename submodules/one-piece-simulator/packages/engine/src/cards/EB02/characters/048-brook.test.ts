import { describe, test } from "vite-plus/test";
import { eb02Brook048 } from "../../../../../cards/src/cards/EB02/characters/048-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-048 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Brook048);
  });
});
