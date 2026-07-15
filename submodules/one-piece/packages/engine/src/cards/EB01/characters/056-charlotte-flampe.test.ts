import { describe, test } from "vite-plus/test";
import { eb01CharlotteFlampe056 } from "../../../../../cards/src/cards/EB01/characters/056-charlotte-flampe.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-056 Charlotte Flampe", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(eb01CharlotteFlampe056);
  });
});
