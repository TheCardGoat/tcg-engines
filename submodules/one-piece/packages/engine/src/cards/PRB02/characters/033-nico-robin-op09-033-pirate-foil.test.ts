import { describe, test } from "vite-plus/test";
import { prb02NicoRobinOp09033PirateFoil033 } from "../../../../../cards/src/cards/PRB02/characters/033-nico-robin-op09-033-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-033 Nico Robin - OP09-033 (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02NicoRobinOp09033PirateFoil033);
  });
});
