import { describe, test } from "vite-plus/test";
import { op08WhosWho091 } from "../../../../../cards/src/cards/OP08/characters/091-whos-who.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-091 Whos.Who", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op08WhosWho091);
  });
});
