import { describe, test } from "vite-plus/test";
import { op08MariaOnionBear009 } from "../../../../../cards/src/cards/OP08/characters/009-maria-onion-bear.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-009 Maria Onion Bear", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08MariaOnionBear009);
  });
});
