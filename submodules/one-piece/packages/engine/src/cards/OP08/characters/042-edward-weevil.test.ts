import { describe, test } from "vite-plus/test";
import { op08EdwardWeevil042 } from "../../../../../cards/src/cards/OP08/characters/042-edward-weevil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-042 Edward Weevil", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08EdwardWeevil042);
  });
});
