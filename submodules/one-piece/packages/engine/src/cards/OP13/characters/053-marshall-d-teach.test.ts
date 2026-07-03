import { describe, test } from "vite-plus/test";
import { op13MarshallDTeach053 } from "../../../../../cards/src/cards/OP13/characters/053-marshall-d-teach.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-053 Marshall.D.Teach", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13MarshallDTeach053);
  });
});
