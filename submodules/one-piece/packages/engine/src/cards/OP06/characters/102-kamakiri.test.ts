import { describe, test } from "vite-plus/test";
import { op06Kamakiri102 } from "../../../../../cards/src/cards/OP06/characters/102-kamakiri.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-102 Kamakiri", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Kamakiri102);
  });
});
