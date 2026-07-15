import { describe, test } from "vite-plus/test";
import { op11Ishilly025 } from "../../../../../cards/src/cards/OP11/characters/025-ishilly.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-025 Ishilly", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Ishilly025);
  });
});
