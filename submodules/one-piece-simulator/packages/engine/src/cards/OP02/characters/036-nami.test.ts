import { describe, test } from "vite-plus/test";
import { op02Nami036 } from "../../../../../cards/src/cards/OP02/characters/036-nami.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-036 Nami", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Nami036);
  });
});
