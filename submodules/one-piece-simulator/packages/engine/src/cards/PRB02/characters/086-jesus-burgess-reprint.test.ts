import { describe, test } from "vite-plus/test";
import { prb02JesusBurgessReprint086 } from "../../../../../cards/src/cards/PRB02/characters/086-jesus-burgess-reprint.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-086 Jesus Burgess (Reprint)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb02JesusBurgessReprint086);
  });
});
