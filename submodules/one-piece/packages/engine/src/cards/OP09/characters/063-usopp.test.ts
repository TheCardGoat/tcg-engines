import { describe, test } from "vite-plus/test";
import { op09Usopp063 } from "../../../../../cards/src/cards/characters/op09-063-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-063 Usopp", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Usopp063);
  });
});
