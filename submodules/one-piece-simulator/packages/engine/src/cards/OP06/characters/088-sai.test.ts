import { describe, test } from "vite-plus/test";
import { op06Sai088 } from "../../../../../cards/src/cards/OP06/characters/088-sai.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-088 Sai", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Sai088);
  });
});
