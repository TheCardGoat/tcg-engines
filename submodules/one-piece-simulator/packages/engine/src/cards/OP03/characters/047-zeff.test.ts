import { describe, test } from "vite-plus/test";
import { op03Zeff047 } from "../../../../../cards/src/cards/OP03/characters/047-zeff.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-047 Zeff", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Zeff047);
  });
});
