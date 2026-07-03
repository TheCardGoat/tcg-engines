import { describe, test } from "vite-plus/test";
import { op07Maha089 } from "../../../../../cards/src/cards/OP07/characters/089-maha.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-089 Maha", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Maha089);
  });
});
