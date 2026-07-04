import { describe, test } from "vite-plus/test";
import { prb02Mr3GaldinoOp09056Reprint056 } from "../../../../../cards/src/cards/PRB02/characters/056-mr-3-galdino-op09-056-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-056 Mr.3(Galdino) - OP09-056 (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02Mr3GaldinoOp09056Reprint056);
  });
});
