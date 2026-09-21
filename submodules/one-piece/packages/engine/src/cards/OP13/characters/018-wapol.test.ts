import { describe, test } from "vite-plus/test";
import { op13Wapol018 } from "../../../../../cards/src/cards/characters/op13-018-wapol.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-018 Wapol", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Wapol018);
  });
});
