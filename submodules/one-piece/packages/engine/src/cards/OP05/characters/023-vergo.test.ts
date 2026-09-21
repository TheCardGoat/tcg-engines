import { describe, test } from "vite-plus/test";
import { op05Vergo023 } from "../../../../../cards/src/cards/characters/op05-023-vergo.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-023 Vergo", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Vergo023);
  });
});
