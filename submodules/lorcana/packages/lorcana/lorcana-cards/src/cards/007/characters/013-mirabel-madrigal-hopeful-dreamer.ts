import type { CharacterCard } from "@tcg/lorcana-types";
import { mirabelMadrigalHopefulDreamerI18n } from "./013-mirabel-madrigal-hopeful-dreamer.i18n";
import { evasive } from "../../../helpers/abilities/evasive";
import { singer } from "../../../helpers/abilities/singer";

export const mirabelMadrigalHopefulDreamer: CharacterCard = {
  id: "sOB",
  canonicalId: "ci_sOB",
  reprints: ["set7-013"],
  cardType: "character",
  name: "Mirabel Madrigal",
  version: "Hopeful Dreamer",
  inkType: ["amber", "amethyst"],
  franchise: "Encanto",
  set: "007",
  cardNumber: 13,
  rarity: "uncommon",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_039fcd98eaf7444ea45cea5da181f1c8",
    tcgPlayer: 618323,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "Singer 5",
    },
  ],
  classifications: ["Storyborn", "Hero", "Madrigal"],
  abilities: [evasive, singer(5)],
  i18n: mirabelMadrigalHopefulDreamerI18n,
};
