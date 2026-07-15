import { describe, test } from "vite-plus/test";
import { op07BoaSandersonia050 } from "../../../../../cards/src/cards/OP07/characters/050-boa-sandersonia.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-050 Boa Sandersonia", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BoaSandersonia050);
  });
});
