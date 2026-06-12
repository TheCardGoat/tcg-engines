import { describe, test } from "vite-plus/test";
import { op05Pica032 } from "../../../../../cards/src/cards/OP05/characters/032-pica.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-032 Pica", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Pica032);
  });
});
