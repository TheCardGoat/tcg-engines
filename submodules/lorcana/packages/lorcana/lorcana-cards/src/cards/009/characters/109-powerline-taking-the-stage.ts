import type { CharacterCard } from "@tcg/lorcana-types";
import { powerlineTakingTheStageI18n } from "./109-powerline-taking-the-stage.i18n";
import { singer } from "../../../helpers/abilities/singer";

export const powerlineTakingTheStage: CharacterCard = {
  id: "aRw",
  canonicalId: "ci_aRw",
  reprints: ["set9-109"],
  cardType: "character",
  name: "Powerline",
  version: "Taking the Stage",
  inkType: ["ruby"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 109,
  rarity: "common",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_7d7835f351084d94aa5f108f373a1de2",
    tcgPlayer: 647682,
  },
  text: "Singer 4",
  classifications: ["Storyborn"],
  abilities: [singer(4)],
  i18n: powerlineTakingTheStageI18n,
};
