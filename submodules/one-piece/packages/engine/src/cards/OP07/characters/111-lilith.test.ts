import { describe, test } from "vite-plus/test";
import { op07Lilith111 } from "../../../../../cards/src/cards/OP07/characters/111-lilith.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-111 Lilith", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Lilith111);
  });
});
