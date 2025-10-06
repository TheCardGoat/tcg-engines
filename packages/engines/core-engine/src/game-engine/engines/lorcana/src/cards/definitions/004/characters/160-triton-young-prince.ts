import { yourBanishedLocations } from "@lorcanito/lorcana-engine/abilities/targets";
import { whenXIsBanished } from "@lorcanito/lorcana-engine/abilities/whenAbilities";
import { putThisCardIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import {
  duringYourTurnGains,
  evasiveAbility,
} from "~/game-engine/engines/lorcana/src/abilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const tritonYoungPrince: LorcanaCharacterCardDefinition = {
  id: "wlm",
  name: "Triton",
  title: "Young Prince",
  characteristics: ["dreamborn", "prince"],
  text: "**SUPERIOR SWIMMER** During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_\n\n\n**KEEPER OF ATLANTICA** Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
  type: "character",
  abilities: [
    {
      type: "static",
      ability: "gain-ability",
      name: "Keeper Of Atlantica",
      text: "Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
      target: yourBanishedLocations,
      gainedAbility: whenXIsBanished({
        name: "Keeper Of Atlantica",
        text: "Whenever one of your locations is banished, you may put that card into your inkwell facedown and exerted.",
        optional: true,
        effects: [putThisCardIntoYourInkwellExerted],
      }),
    },
    duringYourTurnGains(
      "Superior Swimmer",
      "During your turn, this character gains **Evasive**. _(They can challenge characters with Evasive.)_",
      evasiveAbility,
    ),
  ],
  inkwell: true,
  colors: ["sapphire"],
  cost: 4,
  strength: 3,
  willpower: 4,
  lore: 1,
  illustrator: "Malia Ewart",
  number: 160,
  set: "URR",
  rarity: "uncommon",
};
