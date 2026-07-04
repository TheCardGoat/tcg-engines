import { describe, test } from "vite-plus/test";
import { eb03CharlotteLinlin034 } from "../../../../../cards/src/cards/EB03/characters/034-charlotte-linlin.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-034 Charlotte Linlin", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03CharlotteLinlin034);
  });
});
