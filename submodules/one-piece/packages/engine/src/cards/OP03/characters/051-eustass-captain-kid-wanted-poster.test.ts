import { describe, test } from "vite-plus/test";
import { op03EustassCaptainKidWantedPoster051 } from "../../../../../cards/src/cards/OP03/characters/051-eustass-captain-kid-wanted-poster.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-051 051-eustass-captain-kid-wanted-poster", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op03EustassCaptainKidWantedPoster051);
  });
});
