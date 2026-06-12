import { describe, test } from "vite-plus/test";
import { op07EdwardWeevil039 } from "../../../../../cards/src/cards/OP07/characters/039-edward-weevil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-039 Edward Weevil", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07EdwardWeevil039);
  });
});
