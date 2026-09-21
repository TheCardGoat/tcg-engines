import { describe } from "vitest";

import { proveChampionLineage } from "../../../testing/champion-lineage.ts";
import { merlinAmethystsGlow } from "./merlin-amethysts-glow.ts";

/** @covers dPP9I4nVn0-a1 */
describe("Merlin, Amethyst's Glow — Lineage restriction", () => {
  proveChampionLineage({
    card: merlinAmethystsGlow,
    lineageName: "Merlin",
    level: 2,
    memoryCost: 2,
  });
});
