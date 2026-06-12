import { describe, test } from "vite-plus/test";
import { op12KuzanSp082 } from "../../../../../cards/src/cards/OP12/characters/082-kuzan-sp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-082 Kuzan (SP)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12KuzanSp082);
  });
});
