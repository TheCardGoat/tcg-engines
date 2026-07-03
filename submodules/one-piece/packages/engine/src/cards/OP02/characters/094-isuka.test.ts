import { describe, test } from "vite-plus/test";
import { op02Isuka094 } from "../../../../../cards/src/cards/OP02/characters/094-isuka.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-094 Isuka", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Isuka094);
  });
});
