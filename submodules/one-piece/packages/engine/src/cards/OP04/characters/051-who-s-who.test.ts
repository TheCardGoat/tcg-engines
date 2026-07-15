import { describe, test } from "vite-plus/test";
import { op04WhoSWho051 } from "../../../../../cards/src/cards/OP04/characters/051-who-s-who.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-051 Who's.Who", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04WhoSWho051);
  });
});
