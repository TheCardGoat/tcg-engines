import { describe, test } from "vite-plus/test";
import { prb01SakazukiReprint099 } from "../../../../../cards/src/cards/PRB01/characters/099-sakazuki-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-099 Sakazuki (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01SakazukiReprint099);
  });
});
