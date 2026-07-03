import { describe, test } from "vite-plus/test";
import { op09Usopp063 } from "../../../../../cards/src/cards/OP09/characters/063-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-063 Usopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Usopp063);
  });
});
