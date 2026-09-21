import { describe, test } from "vite-plus/test";
import { eb02Komei034 } from "../../../../../cards/src/cards/characters/eb02-034-komei.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB02-034 Komei", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb02Komei034);
  });
});
