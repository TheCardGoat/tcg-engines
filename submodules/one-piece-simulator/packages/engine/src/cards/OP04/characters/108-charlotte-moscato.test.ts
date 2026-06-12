import { describe, test } from "vite-plus/test";
import { op04CharlotteMoscato108 } from "../../../../../cards/src/cards/OP04/characters/108-charlotte-moscato.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-108 Charlotte Moscato", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04CharlotteMoscato108);
  });
});
