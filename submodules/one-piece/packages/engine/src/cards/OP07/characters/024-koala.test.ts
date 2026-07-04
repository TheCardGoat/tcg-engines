import { describe, test } from "vite-plus/test";
import { op07Koala024 } from "../../../../../cards/src/cards/OP07/characters/024-koala.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-024 Koala", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Koala024);
  });
});
