import { describe, test } from "vite-plus/test";
import { op09BartholomewKuma108 } from "../../../../../cards/src/cards/OP09/characters/108-bartholomew-kuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP09-108 Bartholomew Kuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op09BartholomewKuma108);
  });
});
