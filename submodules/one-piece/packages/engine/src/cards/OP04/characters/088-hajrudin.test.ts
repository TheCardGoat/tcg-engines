import { describe, test } from "vite-plus/test";
import { op04Hajrudin088 } from "../../../../../cards/src/cards/OP04/characters/088-hajrudin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-088 Hajrudin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Hajrudin088);
  });
});
