import { describe, test } from "vite-plus/test";
import { op03Kumadori082 } from "../../../../../cards/src/cards/characters/op03-082-kumadori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-082 Kumadori", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kumadori082);
  });
});
