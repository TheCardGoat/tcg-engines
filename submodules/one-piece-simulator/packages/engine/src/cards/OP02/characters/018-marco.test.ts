import { describe, test } from "vite-plus/test";
import { op02Marco018 } from "../../../../../cards/src/cards/OP02/characters/018-marco.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-018 Marco", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02Marco018);
  });
});
