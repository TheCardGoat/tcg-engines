import { describe, test } from "vite-plus/test";
import { eb03CharlotteFlampe032 } from "../../../../../cards/src/cards/EB03/characters/032-charlotte-flampe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB03-032 Charlotte Flampe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb03CharlotteFlampe032);
  });
});
