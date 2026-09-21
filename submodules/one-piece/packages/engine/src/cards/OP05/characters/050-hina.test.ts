import { describe, test } from "vite-plus/test";
import { op05Hina050 } from "../../../../../cards/src/cards/characters/op05-050-hina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-050 Hina", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Hina050);
  });
});
