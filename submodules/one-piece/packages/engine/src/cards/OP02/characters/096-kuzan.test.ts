import { describe, test } from "vite-plus/test";
import { op02Kuzan096 } from "../../../../../cards/src/cards/characters/op02-096-kuzan.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-096 Kuzan", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Kuzan096);
  });
});
