import { describe, test } from "vite-plus/test";
import { op05SanGorou065 } from "../../../../../cards/src/cards/characters/op05-065-san-gorou.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-065 San-Gorou", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05SanGorou065);
  });
});
