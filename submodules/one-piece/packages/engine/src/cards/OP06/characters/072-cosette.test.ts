import { describe, test } from "vite-plus/test";
import { op06Cosette072 } from "../../../../../cards/src/cards/OP06/characters/072-cosette.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-072 Cosette", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Cosette072);
  });
});
