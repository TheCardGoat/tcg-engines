import { describe, test } from "vite-plus/test";
import { prb02Koby001 } from "../../../../../cards/src/cards/PRB02/characters/001-koby.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-001 Koby", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Koby001);
  });
});
