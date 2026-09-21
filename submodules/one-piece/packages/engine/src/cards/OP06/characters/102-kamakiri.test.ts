import { describe, test } from "vite-plus/test";
import { op06Kamakiri102 } from "../../../../../cards/src/cards/characters/op06-102-kamakiri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-102 Kamakiri", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Kamakiri102);
  });
});
