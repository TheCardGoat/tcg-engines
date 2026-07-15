import { describe, test } from "vite-plus/test";
import { prb02GodThreadPirateFoil079 } from "../../../../../cards/src/cards/PRB02/events/079-god-thread-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP10-079 God Thread (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02GodThreadPirateFoil079);
  });
});
