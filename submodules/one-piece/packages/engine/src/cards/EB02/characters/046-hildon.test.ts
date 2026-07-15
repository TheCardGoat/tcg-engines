import { describe, test } from "vite-plus/test";
import { eb02Hildon046 } from "../../../../../cards/src/cards/EB02/characters/046-hildon.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-046 Hildon", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Hildon046);
  });
});
