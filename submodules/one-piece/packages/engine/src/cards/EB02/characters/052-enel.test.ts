import { describe, test } from "vite-plus/test";
import { eb02Enel052 } from "../../../../../cards/src/cards/EB02/characters/052-enel.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-052 Enel", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Enel052);
  });
});
