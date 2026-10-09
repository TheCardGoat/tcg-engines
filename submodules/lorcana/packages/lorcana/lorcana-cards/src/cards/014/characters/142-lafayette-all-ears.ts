import type { CharacterCard } from "@tcg/lorcana-types";
import { alert } from "../../../helpers/abilities";
import { lafayetteAllEarsI18n } from "./142-lafayette-all-ears.i18n";

export const lafayetteAllEars: CharacterCard = {
  id: "xtK",
  canonicalId: "ci_xtK",
  slug: "lorcana-ci_xtK",
  printings: [
    {
      id: "set14-142",
      artId: "set14-142",
      setCode: "set14",
      collectorNumber: "142",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-142"],
  cardType: "character",
  name: "Lafayette",
  version: "All Ears",
  inkType: ["sapphire"],
  franchise: "Aristocats",
  set: "014",
  cardNumber: 142,
  rarity: "uncommon",
  cost: 2,
  strength: 1,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn"],
  abilities: [alert],
  i18n: lafayetteAllEarsI18n,
};
