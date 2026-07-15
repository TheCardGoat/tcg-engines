import { describe, test } from "vite-plus/test";
import { op04Apis041 } from "../../../../../cards/src/cards/OP04/characters/041-apis.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-041 Apis", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Apis041);
  });
});
