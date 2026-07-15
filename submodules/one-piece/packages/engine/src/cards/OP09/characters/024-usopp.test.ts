import { describe, test } from "vite-plus/test";
import { op09Usopp024 } from "../../../../../cards/src/cards/OP09/characters/024-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-024 Usopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Usopp024);
  });
});
