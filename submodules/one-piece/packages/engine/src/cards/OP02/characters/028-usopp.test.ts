import { describe, test } from "vite-plus/test";
import { op02Usopp028 } from "../../../../../cards/src/cards/characters/op02-028-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-028 Usopp", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Usopp028);
  });
});
