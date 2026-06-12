import { describe, test } from "vite-plus/test";
import { op07Hamburg068 } from "../../../../../cards/src/cards/OP07/characters/068-hamburg.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-068 Hamburg", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Hamburg068);
  });
});
