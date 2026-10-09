import type { CharacterCard } from "@tcg/lorcana-types";
import { bodyguard } from "../../../helpers/abilities/bodyguard";
import { challenger } from "../../../helpers/abilities/challenger";
import { woolterJesseBellwethersHenchmenI18n } from "./178-woolter-jesse-bellwethers-henchmen.i18n";

export const woolterJesseBellwethersHenchmen: CharacterCard = {
  id: "iOz",
  canonicalId: "ci_iOz",
  slug: "lorcana-ci_iOz",
  printings: [
    {
      id: "set14-178",
      artId: "set14-178",
      setCode: "set14",
      collectorNumber: "178",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-178"],
  cardType: "character",
  name: "Woolter & Jesse",
  version: "Bellwether's Henchmen",
  inkType: ["steel"],
  franchise: "Zootropolis",
  set: "014",
  cardNumber: 178,
  rarity: "uncommon",
  cost: 3,
  strength: 4,
  willpower: 4,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_f6b191e458c8495f909626b47e1f2995",
  },
  text: [
    {
      title: "Bodyguard",
    },
    {
      title: "Challenger +2",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [bodyguard, challenger(2)],
  i18n: woolterJesseBellwethersHenchmenI18n,
};
