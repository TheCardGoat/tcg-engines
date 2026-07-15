import { describe, test } from "vite-plus/test";
import { prb02JustShutUpAndComeWithUsPirateFoil009 } from "../../../../../cards/src/cards/PRB02/events/009-just-shut-up-and-come-with-us-pirate-foil.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("EB01-009 Just Shut Up and Come with Us!!!! (Pirate Foil)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JustShutUpAndComeWithUsPirateFoil009);
  });
});
