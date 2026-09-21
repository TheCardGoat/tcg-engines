import { describe, test } from "vite-plus/test";
import { op04WhoSWho051 } from "../../../../../cards/src/cards/characters/op04-051-who-s-who.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-051 Who's.Who", () => {
  test.skip("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04WhoSWho051);
  });
});
