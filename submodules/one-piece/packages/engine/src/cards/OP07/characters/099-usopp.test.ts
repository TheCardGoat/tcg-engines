import { describe, test } from "vite-plus/test";
import { op07Usopp099 } from "../../../../../cards/src/cards/OP07/characters/099-usopp.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-099 Usopp", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Usopp099);
  });
});
