import { describe, test } from "vite-plus/test";
import { op01Inuarashi034 } from "../../../../../cards/src/cards/characters/op01-034-inuarashi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-034 Inuarashi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Inuarashi034);
  });
});
