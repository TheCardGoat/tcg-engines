import type { CharacterCard } from "@tcg/lorcana-types";
import { drHamstervielEvilObserverI18n } from "./184-dr-hamsterviel-evil-observer.i18n";

export const drHamstervielEvilObserver: CharacterCard = {
  id: "0zk",
  canonicalId: "ci_0zk",
  slug: "lorcana-ci_0zk",
  printings: [
    {
      id: "set13-184",
      artId: "set13-184",
      setCode: "set13",
      collectorNumber: "184",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-184"],
  cardType: "character",
  name: "Dr. Hamsterviel",
  version: "Evil Observer",
  inkType: ["steel"],
  franchise: "Lilo and Stitch",
  set: "013",
  cardNumber: 184,
  rarity: "uncommon",
  cost: 3,
  strength: 3,
  willpower: 4,
  lore: 1,
  inkable: true,
  text: [
    {
      title: "Alert",
      description: "(This character can challenge as if they had Evasive.)",
    },
  ],
  classifications: ["Storyborn", "Villain", "Alien", "Inventor"],
  abilities: [
    {
      type: "keyword",
      keyword: "Alert",
    },
  ],
  i18n: drHamstervielEvilObserverI18n,
};
