import { describe, test } from "vite-plus/test";
import { op02Dogura010 } from "../../../../../cards/src/cards/OP02/characters/010-dogura.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-010 Dogura", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Dogura010);
  });
});
