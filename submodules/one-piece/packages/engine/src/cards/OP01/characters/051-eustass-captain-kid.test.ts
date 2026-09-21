import { describe, test } from "vite-plus/test";
import { op01EustassCaptainKid051 } from "../../../../../cards/src/cards/characters/op01-051-eustass-captain-kid.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-051 051-eustass-captain-kid", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01EustassCaptainKid051);
  });
});
