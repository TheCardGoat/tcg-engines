import { describe, test } from "vite-plus/test";
import { op06Daruma029 } from "../../../../../cards/src/cards/OP06/characters/029-daruma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-029 Daruma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Daruma029);
  });
});
