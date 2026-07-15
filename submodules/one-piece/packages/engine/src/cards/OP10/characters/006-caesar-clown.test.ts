import { describe, test } from "vite-plus/test";
import { op10CaesarClown006 } from "../../../../../cards/src/cards/OP10/characters/006-caesar-clown.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-006 Caesar Clown", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10CaesarClown006);
  });
});
