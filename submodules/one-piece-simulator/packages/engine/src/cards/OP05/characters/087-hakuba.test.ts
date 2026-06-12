import { describe, test } from "vite-plus/test";
import { op05Hakuba087 } from "../../../../../cards/src/cards/OP05/characters/087-hakuba.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-087 Hakuba", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Hakuba087);
  });
});
