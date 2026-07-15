import { describe, test } from "vite-plus/test";
import { op02BartholomewKuma057 } from "../../../../../cards/src/cards/OP02/characters/057-bartholomew-kuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP02-057 Bartholomew Kuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op02BartholomewKuma057);
  });
});
