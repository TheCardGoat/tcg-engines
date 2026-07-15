import { describe, test } from "vite-plus/test";
import { prb02OhComeMyWayPirateFoil038 } from "../../../../../cards/src/cards/PRB02/events/038-oh-come-my-way-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-038 Oh Come My Way (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02OhComeMyWayPirateFoil038);
  });
});
