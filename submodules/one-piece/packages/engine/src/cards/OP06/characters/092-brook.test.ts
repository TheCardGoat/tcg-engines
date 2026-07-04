import { describe, test } from "vite-plus/test";
import { op06Brook092 } from "../../../../../cards/src/cards/OP06/characters/092-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-092 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Brook092);
  });
});
