import { describe, test } from "vite-plus/test";
import { eb01Koza004 } from "../../../../../cards/src/cards/EB01/characters/004-koza.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-004 Koza", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01Koza004);
  });
});
