import { describe, test } from "vite-plus/test";
import { op08WhosWho091 } from "../../../../../cards/src/cards/characters/op08-091-whos-who.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-091 Whos.Who", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08WhosWho091);
  });
});
