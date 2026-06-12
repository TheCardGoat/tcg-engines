import { describe, test } from "vite-plus/test";
import { op06Aramaki043 } from "../../../../../cards/src/cards/OP06/characters/043-aramaki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-043 Aramaki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Aramaki043);
  });
});
