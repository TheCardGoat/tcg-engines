import { describe, test } from "vite-plus/test";
import { op06NamiTr007 } from "../../../../../cards/src/cards/OP06/characters/007-nami-tr.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("ST01-007 Nami (TR)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06NamiTr007);
  });
});
