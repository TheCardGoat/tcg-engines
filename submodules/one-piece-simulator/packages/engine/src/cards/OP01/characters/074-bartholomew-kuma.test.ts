import { describe, test } from "vite-plus/test";
import { op01BartholomewKuma074 } from "../../../../../cards/src/cards/OP01/characters/074-bartholomew-kuma.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP01-074 Bartholomew Kuma", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(op01BartholomewKuma074);
  });
});
