import { describe, test } from "vite-plus/test";
import { op05Shirahoshi082 } from "../../../../../cards/src/cards/OP05/characters/082-shirahoshi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-082 Shirahoshi", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Shirahoshi082);
  });
});
