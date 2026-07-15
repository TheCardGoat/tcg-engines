import { describe, test } from "vite-plus/test";
import { op01King091 } from "../../../../../cards/src/cards/OP01/leaders/091-king.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-091 King", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01King091);
  });
});
