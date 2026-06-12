import { describe, test } from "vite-plus/test";
import { op10CaesarClown002 } from "../../../../../cards/src/cards/OP10/leaders/002-caesar-clown.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-002 Caesar Clown", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op10CaesarClown002);
  });
});
