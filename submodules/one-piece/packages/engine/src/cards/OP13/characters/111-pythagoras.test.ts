import { describe, test } from "vite-plus/test";
import { op13Pythagoras111 } from "../../../../../cards/src/cards/OP13/characters/111-pythagoras.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-111 Pythagoras", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Pythagoras111);
  });
});
