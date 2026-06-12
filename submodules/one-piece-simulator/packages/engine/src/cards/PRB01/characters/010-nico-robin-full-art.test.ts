import { describe, test } from "vite-plus/test";
import { prb01NicoRobinFullArt010 } from "../../../../../cards/src/cards/PRB01/characters/010-nico-robin-full-art.ts";
import { validateCardAbility } from "../../card-behavior-harness.ts";

describe("OP05-010 Nico Robin (Full Art)", () => {
  test("validates its ability through OnePieceTestEngine", () => {
    validateCardAbility(prb01NicoRobinFullArt010);
  });
});
