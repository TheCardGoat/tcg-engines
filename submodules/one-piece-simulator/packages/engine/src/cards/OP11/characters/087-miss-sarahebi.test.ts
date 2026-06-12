import { describe, test } from "vite-plus/test";
import { op11MissSarahebi087 } from "../../../../../cards/src/cards/OP11/characters/087-miss-sarahebi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-087 Miss Sarahebi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11MissSarahebi087);
  });
});
