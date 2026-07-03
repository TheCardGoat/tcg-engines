import { describe, test } from "vite-plus/test";
import { op12Tashigi031 } from "../../../../../cards/src/cards/OP12/characters/031-tashigi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-031 Tashigi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Tashigi031);
  });
});
