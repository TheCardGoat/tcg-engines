import { describe, test } from "vite-plus/test";
import { op02Inuarashi027 } from "../../../../../cards/src/cards/characters/op02-027-inuarashi.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-027 Inuarashi", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Inuarashi027);
  });
});
