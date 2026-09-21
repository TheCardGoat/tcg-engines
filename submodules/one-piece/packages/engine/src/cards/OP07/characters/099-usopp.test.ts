import { describe, test } from "vite-plus/test";
import { op07Usopp099 } from "../../../../../cards/src/cards/characters/op07-099-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-099 Usopp", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Usopp099);
  });
});
