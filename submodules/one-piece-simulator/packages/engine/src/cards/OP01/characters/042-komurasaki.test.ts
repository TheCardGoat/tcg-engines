import { describe, test } from "vite-plus/test";
import { op01Komurasaki042 } from "../../../../../cards/src/cards/OP01/characters/042-komurasaki.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-042 Komurasaki", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01Komurasaki042);
  });
});
