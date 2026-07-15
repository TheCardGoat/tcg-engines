import type { CharacterCard } from "@tcg/lorcana-types";
import { kuzcoWantedLlamaI18n } from "./049-kuzco-wanted-llama.i18n";

export const kuzcoWantedLlama: CharacterCard = {
  id: "Ajn",
  canonicalId: "ci_AlR",
  slug: "lorcana-ci_AlR",
  printings: [
    {
      id: "set9-049",
      artId: "set9-049",
      setCode: "set9",
      collectorNumber: "49",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set2-045", "set9-049"],
  cardType: "character",
  name: "Kuzco",
  version: "Wanted Llama",
  inkType: ["amethyst"],
  franchise: "Emperors New Groove",
  set: "009",
  cardNumber: 49,
  rarity: "common",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_21489dcd479a4d209a1b740f356fff6f",
    tcgPlayer: "647657",
  },
  text: [
    {
      title: "OK, WHERE AM",
      description: "I? When this character is banished, you may draw a card.",
    },
  ],
  classifications: ["Storyborn", "King"],
  abilities: [
    {
      id: "zpa-1",
      name: "OK, WHERE AM I?",
      text: "OK, WHERE AM I? When this character is banished, you may draw a card.",
      type: "triggered",
      trigger: {
        event: "banish",
        on: "SELF",
        timing: "when",
      },
      effect: {
        type: "optional",
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: "CONTROLLER",
          type: "draw",
        },
      },
    },
  ],
  i18n: kuzcoWantedLlamaI18n,
};
