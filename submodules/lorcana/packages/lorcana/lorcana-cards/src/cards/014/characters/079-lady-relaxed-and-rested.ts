import type { CharacterCard } from "@tcg/lorcana-types";
import { ladyRelaxedAndRestedI18n } from "./079-lady-relaxed-and-rested.i18n";
import { ward } from "../../../helpers/abilities/ward";

export const ladyRelaxedAndRested: CharacterCard = {
  id: "4Ao",
  canonicalId: "ci_4Ao",
  slug: "lorcana-ci_4Ao",
  printings: [
    {
      id: "set14-079",
      artId: "set14-079",
      setCode: "set14",
      collectorNumber: "79",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set14-079"],
  cardType: "character",
  name: "Lady",
  version: "Relaxed and Rested",
  inkType: ["emerald"],
  franchise: "Lady and the Tramp",
  set: "014",
  cardNumber: 79,
  rarity: "uncommon",
  cost: 1,
  strength: 3,
  willpower: 1,
  lore: 1,
  inkable: false,
  text: "Ward",
  classifications: ["Storyborn", "Hero"],
  abilities: [ward],
  i18n: ladyRelaxedAndRestedI18n,
};
