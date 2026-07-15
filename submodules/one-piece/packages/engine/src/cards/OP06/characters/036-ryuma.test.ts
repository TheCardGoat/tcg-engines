import { describe, test } from "vite-plus/test";
import { op06Ryuma036 } from "../../../../../cards/src/cards/OP06/characters/036-ryuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-036 Ryuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Ryuma036);
  });
});
