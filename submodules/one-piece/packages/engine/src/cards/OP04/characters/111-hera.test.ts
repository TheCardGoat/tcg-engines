import { describe, test } from "vite-plus/test";
import { op04Hera111 } from "../../../../../cards/src/cards/OP04/characters/111-hera.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-111 Hera", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Hera111);
  });
});
