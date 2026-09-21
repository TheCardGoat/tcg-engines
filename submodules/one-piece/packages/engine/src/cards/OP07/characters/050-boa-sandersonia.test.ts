import { describe, test } from "vite-plus/test";
import { op07BoaSandersonia050 } from "../../../../../cards/src/cards/characters/op07-050-boa-sandersonia.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-050 Boa Sandersonia", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07BoaSandersonia050);
  });
});
