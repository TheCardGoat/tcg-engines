import { describe, test } from "vite-plus/test";
import { op04Otama097 } from "../../../../../cards/src/cards/OP04/characters/097-otama.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-097 Otama", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Otama097);
  });
});
