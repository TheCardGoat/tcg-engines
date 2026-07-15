import { describe, test } from "vite-plus/test";
import { op01Marco023 } from "../../../../../cards/src/cards/OP01/characters/023-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-023 Marco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Marco023);
  });
});
