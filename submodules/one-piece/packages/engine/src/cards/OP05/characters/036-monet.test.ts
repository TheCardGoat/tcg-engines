import { describe, test } from "vite-plus/test";
import { op05Monet036 } from "../../../../../cards/src/cards/OP05/characters/036-monet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-036 Monet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Monet036);
  });
});
