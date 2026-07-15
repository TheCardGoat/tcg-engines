import { describe, test } from "vite-plus/test";
import { prb02DidSomeoneSayKamiPirateFoil060 } from "../../../../../cards/src/cards/PRB02/events/060-did-someone-say-kami-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-060 Did Someone Say...Kami? (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02DidSomeoneSayKamiPirateFoil060);
  });
});
