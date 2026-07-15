import { describe, test } from "vite-plus/test";
import { op08Nami106 } from "../../../../../cards/src/cards/OP08/characters/106-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-106 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08Nami106);
  });
});
