import { describe, test } from "vite-plus/test";
import { op03Zambai063 } from "../../../../../cards/src/cards/OP03/characters/063-zambai.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-063 Zambai", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Zambai063);
  });
});
