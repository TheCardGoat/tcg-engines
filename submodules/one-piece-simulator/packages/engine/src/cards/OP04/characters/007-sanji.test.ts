import { describe, test } from "vite-plus/test";
import { op04Sanji007 } from "../../../../../cards/src/cards/OP04/characters/007-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-007 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Sanji007);
  });
});
