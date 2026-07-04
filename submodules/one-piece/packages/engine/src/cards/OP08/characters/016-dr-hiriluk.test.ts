import { describe, test } from "vite-plus/test";
import { op08DrHiriluk016 } from "../../../../../cards/src/cards/OP08/characters/016-dr-hiriluk.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-016 Dr.Hiriluk", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08DrHiriluk016);
  });
});
