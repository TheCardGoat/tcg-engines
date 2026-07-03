import { describe, test } from "vite-plus/test";
import { prb01PortgasDAceManga013 } from "../../../../../cards/src/cards/PRB01/characters/013-portgas-d-ace-manga.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-013 Portgas.D.Ace (Manga)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01PortgasDAceManga013);
  });
});
