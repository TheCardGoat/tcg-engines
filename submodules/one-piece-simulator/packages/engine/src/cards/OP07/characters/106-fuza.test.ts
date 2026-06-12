import { describe, test } from "vite-plus/test";
import { op07Fuza106 } from "../../../../../cards/src/cards/OP07/characters/106-fuza.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-106 Fuza", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Fuza106);
  });
});
