import { describe, test } from "vite-plus/test";
import { op13BoaSandersonia050 } from "../../../../../cards/src/cards/OP13/characters/050-boa-sandersonia.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-050 Boa Sandersonia", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13BoaSandersonia050);
  });
});
