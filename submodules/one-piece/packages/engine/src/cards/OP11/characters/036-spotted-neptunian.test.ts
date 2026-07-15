import { describe, test } from "vite-plus/test";
import { op11SpottedNeptunian036 } from "../../../../../cards/src/cards/OP11/characters/036-spotted-neptunian.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-036 Spotted Neptunian", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11SpottedNeptunian036);
  });
});
