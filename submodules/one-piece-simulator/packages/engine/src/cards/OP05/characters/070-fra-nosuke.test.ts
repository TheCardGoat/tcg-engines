import { describe, test } from "vite-plus/test";
import { op05FraNosuke070 } from "../../../../../cards/src/cards/OP05/characters/070-fra-nosuke.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-070 Fra-Nosuke", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05FraNosuke070);
  });
});
