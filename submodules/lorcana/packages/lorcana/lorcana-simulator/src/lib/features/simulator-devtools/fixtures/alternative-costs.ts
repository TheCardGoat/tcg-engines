import { createFixture } from "./fixture-factory";
import {
  belleApprenticeInventor,
  scroogeMcduckResourcefulMiser,
} from "@tcg/lorcana-cards/cards/007";
import {
  amberCoil,
  amethystCoil,
  emeraldCoil,
  rubyCoil,
  sapphireCoil,
} from "@tcg/lorcana-cards/cards/007";
import { mickeyMouseArtfulRogue, reflection } from "@tcg/lorcana-cards/cards/001";
import { liloBestExplorerEver } from "@tcg/lorcana-cards/cards/009";
import {
  angelExperiment624,
  mickeyMouseBobCratchit,
  retroEvolutionDevice,
} from "@tcg/lorcana-cards/cards/011";

export const alternativeCostsFixture = createFixture({
  id: "alternative-costs",
  name: "Alternative Costs",
  description:
    "Testing alternative cost UI: Belle (banish item to play for free) and Scrooge McDuck (exert 4 items to play for free). Player has 0 ink to force alternative cost usage.",
  skipPreGame: true,
  playerOne: {
    inkwell: 0,
    hand: [belleApprenticeInventor, scroogeMcduckResourcefulMiser, mickeyMouseBobCratchit],
    play: [
      amberCoil,
      amethystCoil,
      emeraldCoil,
      rubyCoil,
      sapphireCoil,
      retroEvolutionDevice,
      mickeyMouseArtfulRogue,
      angelExperiment624,
    ],
    deck: [reflection, reflection],
  },
  playerTwo: {
    hand: [reflection],
    play: [liloBestExplorerEver],
    deck: [reflection, reflection],
  },
});
