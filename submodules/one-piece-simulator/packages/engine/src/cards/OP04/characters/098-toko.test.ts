import { describe, test } from "vite-plus/test";
import { op04Toko098 } from "../../../../../cards/src/cards/OP04/characters/098-toko.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP04-098 Toko", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op04Toko098);
  });
});
