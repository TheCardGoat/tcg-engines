import { describe, test } from "vite-plus/test";
import { op05Vergo023 } from "../../../../../cards/src/cards/OP05/characters/023-vergo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-023 Vergo", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Vergo023);
  });
});
