import { describe, test } from "vite-plus/test";
import { op10BlueGilly054 } from "../../../../../cards/src/cards/OP10/characters/054-blue-gilly.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-054 Blue Gilly", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10BlueGilly054);
  });
});
