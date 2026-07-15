import { describe, test } from "vite-plus/test";
import { op12Borsalino053 } from "../../../../../cards/src/cards/OP12/characters/053-borsalino.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-053 Borsalino", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Borsalino053);
  });
});
