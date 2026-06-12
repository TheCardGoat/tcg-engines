import { describe, test } from "vite-plus/test";
import { op13Uta023 } from "../../../../../cards/src/cards/OP13/characters/023-uta.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP13-023 Uta", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op13Uta023);
  });
});
