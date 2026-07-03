import { describe, test } from "vite-plus/test";
import { op03Fossa010 } from "../../../../../cards/src/cards/OP03/characters/010-fossa.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP03-010 Fossa", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03Fossa010);
  });
});
