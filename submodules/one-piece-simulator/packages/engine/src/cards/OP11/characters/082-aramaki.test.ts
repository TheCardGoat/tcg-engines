import { describe, test } from "vite-plus/test";
import { op11Aramaki082 } from "../../../../../cards/src/cards/OP11/characters/082-aramaki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP11-082 Aramaki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op11Aramaki082);
  });
});
