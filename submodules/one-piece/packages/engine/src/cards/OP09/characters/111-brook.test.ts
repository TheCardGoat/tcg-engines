import { describe, test } from "vite-plus/test";
import { op09Brook111 } from "../../../../../cards/src/cards/OP09/characters/111-brook.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-111 Brook", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09Brook111);
  });
});
