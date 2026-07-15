import { describe, test } from "vite-plus/test";
import { op08CharlottePoire104 } from "../../../../../cards/src/cards/OP08/characters/104-charlotte-poire.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-104 Charlotte Poire", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08CharlottePoire104);
  });
});
