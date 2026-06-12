import { describe, test } from "vite-plus/test";
import { prb02Germa66PirateFoil078 } from "../../../../../cards/src/cards/PRB02/events/078-germa-66-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP06-078 GERMA 66 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Germa66PirateFoil078);
  });
});
