import { describe, test } from "vite-plus/test";
import { op12BartholomewKuma119 } from "../../../../../cards/src/cards/OP12/characters/119-bartholomew-kuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP12-119 Bartholomew Kuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op12BartholomewKuma119);
  });
});
