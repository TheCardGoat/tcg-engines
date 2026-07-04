import { describe, test } from "vite-plus/test";
import { op05Hina050 } from "../../../../../cards/src/cards/OP05/characters/050-hina.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-050 Hina", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op05Hina050);
  });
});
