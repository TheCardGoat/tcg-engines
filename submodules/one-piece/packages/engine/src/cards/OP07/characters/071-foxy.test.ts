import { describe, test } from "vite-plus/test";
import { op07Foxy071 } from "../../../../../cards/src/cards/OP07/characters/071-foxy.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-071 Foxy", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Foxy071);
  });
});
