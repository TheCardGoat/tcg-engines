import { describe, test } from "vite-plus/test";
import { op05NamiSp016 } from "../../../../../cards/src/cards/OP05/characters/016-nami-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-016 Nami (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05NamiSp016);
  });
});
