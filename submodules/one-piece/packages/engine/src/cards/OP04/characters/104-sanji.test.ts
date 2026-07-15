import { describe, test } from "vite-plus/test";
import { op04Sanji104 } from "../../../../../cards/src/cards/OP04/characters/104-sanji.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-104 Sanji", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Sanji104);
  });
});
