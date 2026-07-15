import { describe, test } from "vite-plus/test";
import { op06KingdomOfGerma079 } from "../../../../../cards/src/cards/OP06/stages/079-kingdom-of-germa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-079 Kingdom of GERMA", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op06KingdomOfGerma079);
  });
});
