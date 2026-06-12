import { describe, test } from "vite-plus/test";
import { op08Alber059 } from "../../../../../cards/src/cards/OP08/characters/059-alber.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-059 Alber", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Alber059);
  });
});
