import { describe, test } from "vite-plus/test";
import { op06IkarosMuch024 } from "../../../../../cards/src/cards/OP06/characters/024-ikaros-much.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-024 Ikaros Much", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06IkarosMuch024);
  });
});
