import { describe, test } from "vite-plus/test";
import { prb02BlackMariaReprint074 } from "../../../../../cards/src/cards/PRB02/characters/074-black-maria-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP08-074 Black Maria (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02BlackMariaReprint074);
  });
});
