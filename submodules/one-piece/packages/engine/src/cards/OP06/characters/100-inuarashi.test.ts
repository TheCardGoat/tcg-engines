import { describe, test } from "vite-plus/test";
import { op06Inuarashi100 } from "../../../../../cards/src/cards/OP06/characters/100-inuarashi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-100 Inuarashi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Inuarashi100);
  });
});
