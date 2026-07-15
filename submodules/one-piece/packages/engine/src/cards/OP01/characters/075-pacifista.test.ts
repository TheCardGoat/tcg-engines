import { describe, test } from "vite-plus/test";
import { op01Pacifista075 } from "../../../../../cards/src/cards/OP01/characters/075-pacifista.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-075 Pacifista", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Pacifista075);
  });
});
