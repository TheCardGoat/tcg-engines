import { describe } from "vitest";
import { apothecarysHarvest } from "./apothecarys-harvest.ts";
import { blightroot } from "../../ALC/tokens/blightroot.ts";
import { manaroot } from "../../ALC/tokens/manaroot.ts";
import { silvershine } from "../../ALC/tokens/silvershine.ts";
import { fraysia } from "../../ALC/tokens/fraysia.ts";
import { razorvine } from "../../ALC/tokens/razorvine.ts";
import { springleaf } from "../../ALC/tokens/springleaf.ts";
import { proveSummonAction } from "../../../testing/summon-action.ts";
/** @covers kJoyEo9Ls1-a3 */
describe("apothecarysHarvest", () => {
  proveSummonAction({
    card: apothecarysHarvest,
    cost: 3,
    tokens: [
      { card: blightroot, count: 1 },
      { card: manaroot, count: 1 },
      { card: silvershine, count: 1 },
      { card: fraysia, count: 1 },
      { card: razorvine, count: 1 },
      { card: springleaf, count: 1 },
    ],
  });
});
