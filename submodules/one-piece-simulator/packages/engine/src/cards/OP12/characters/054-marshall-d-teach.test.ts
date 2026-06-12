import { describe, test } from "vite-plus/test";
import { op12MarshallDTeach054 } from "../../../../../cards/src/cards/OP12/characters/054-marshall-d-teach.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-054 Marshall.D.Teach", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12MarshallDTeach054);
  });
});
