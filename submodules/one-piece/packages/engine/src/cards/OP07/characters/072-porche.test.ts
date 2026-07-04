import { describe, test } from "vite-plus/test";
import { op07Porche072 } from "../../../../../cards/src/cards/OP07/characters/072-porche.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-072 Porche", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Porche072);
  });
});
