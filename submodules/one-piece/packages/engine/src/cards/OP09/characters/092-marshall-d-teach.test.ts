import { describe, test } from "vite-plus/test";
import { op09MarshallDTeach092 } from "../../../../../cards/src/cards/OP09/characters/092-marshall-d-teach.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-092 Marshall.D.Teach", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MarshallDTeach092);
  });
});
