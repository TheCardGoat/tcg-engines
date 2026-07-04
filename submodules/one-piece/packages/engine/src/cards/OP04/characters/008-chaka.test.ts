import { describe, test } from "vite-plus/test";
import { op04Chaka008 } from "../../../../../cards/src/cards/OP04/characters/008-chaka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-008 Chaka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Chaka008);
  });
});
