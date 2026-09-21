import { describe, test } from "vite-plus/test";
import { op09Usopp024 } from "../../../../../cards/src/cards/characters/op09-024-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-024 Usopp", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Usopp024);
  });
});
