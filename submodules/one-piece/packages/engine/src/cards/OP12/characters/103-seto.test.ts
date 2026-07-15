import { describe, test } from "vite-plus/test";
import { op12Seto103 } from "../../../../../cards/src/cards/OP12/characters/103-seto.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-103 Seto", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Seto103);
  });
});
