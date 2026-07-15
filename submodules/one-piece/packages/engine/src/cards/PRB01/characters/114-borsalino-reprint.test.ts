import { describe, test } from "vite-plus/test";
import { prb01BorsalinoReprint114 } from "../../../../../cards/src/cards/PRB01/characters/114-borsalino-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-114 Borsalino (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01BorsalinoReprint114);
  });
});
