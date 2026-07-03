import { describe, test } from "vite-plus/test";
import { op07Otama022 } from "../../../../../cards/src/cards/OP07/characters/022-otama.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP07-022 Otama", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op07Otama022);
  });
});
