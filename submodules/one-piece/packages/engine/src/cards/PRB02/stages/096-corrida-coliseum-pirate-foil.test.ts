import { describe, test } from "vite-plus/test";
import { prb02CorridaColiseumPirateFoil096 } from "../../../../../cards/src/cards/PRB02/stages/096-corrida-coliseum-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-096 Corrida Coliseum (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02CorridaColiseumPirateFoil096);
  });
});
