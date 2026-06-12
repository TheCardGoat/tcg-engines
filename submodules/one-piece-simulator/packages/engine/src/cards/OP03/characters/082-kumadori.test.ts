import { describe, test } from "vite-plus/test";
import { op03Kumadori082 } from "../../../../../cards/src/cards/OP03/characters/082-kumadori.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-082 Kumadori", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Kumadori082);
  });
});
