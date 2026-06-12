import { describe, test } from "vite-plus/test";
import { op05RikuDoldoIii090 } from "../../../../../cards/src/cards/OP05/characters/090-riku-doldo-iii.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-090 Riku Doldo III", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05RikuDoldoIii090);
  });
});
