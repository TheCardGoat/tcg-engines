import { describe, test } from "vite-plus/test";
import { op09MonkeyDLuffyWantedPoster119 } from "../../../../../cards/src/cards/OP09/characters/119-monkey-d-luffy-wanted-poster.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-119 Monkey.D.Luffy (Wanted Poster)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09MonkeyDLuffyWantedPoster119);
  });
});
