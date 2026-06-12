import { describe, test } from "vite-plus/test";
import { prb02PortgasDAcePrb02018018 } from "../../../../../cards/src/cards/PRB02/characters/018-portgas-d-ace-prb02-018.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("PRB02-018 Portgas.D.Ace - PRB02-018", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02PortgasDAcePrb02018018);
  });
});
