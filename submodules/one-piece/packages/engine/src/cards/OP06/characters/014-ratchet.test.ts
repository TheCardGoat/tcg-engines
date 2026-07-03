import { describe, test } from "vite-plus/test";
import { op06Ratchet014 } from "../../../../../cards/src/cards/OP06/characters/014-ratchet.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-014 Ratchet", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06Ratchet014);
  });
});
