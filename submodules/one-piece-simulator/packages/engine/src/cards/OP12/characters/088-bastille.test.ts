import { describe, test } from "vite-plus/test";
import { op12Bastille088 } from "../../../../../cards/src/cards/OP12/characters/088-bastille.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-088 Bastille", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12Bastille088);
  });
});
