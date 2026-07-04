import type { CharacterCard } from "@tcg/lorcana-types";
import { arielAdventurousCollectorEnchantedI18n } from "./232-ariel-adventurous-collector-enchanted.i18n";

import { evasive } from "../../../helpers/abilities/evasive";

export const arielAdventurousCollectorEnchanted: CharacterCard = {
  id: "7hh",
  canonicalId: "ci_6BB",
  slug: "lorcana-ci_6BB",
  printings: [
    {
      id: "set9-232-enchanted",
      artId: "ci_6BB-enchanted",
      setCode: "set9",
      collectorNumber: "232",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set3-103", "set9-107"],
  cardType: "character",
  name: "Ariel",
  version: "Adventurous Collector",
  inkType: ["ruby"],
  franchise: "Little Mermaid",
  set: "009",
  cardNumber: 232,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e6a1d03334964fb78033020d86a5f502",
    tcgPlayer: "651123",
  },
  text: "Evasive INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    evasive,
    {
      effect: {
        keyword: "Evasive",
        duration: "until-start-of-next-turn",
        target: {
          cardTypes: ["character"],
          count: 1,
          owner: "you",
          selector: "chosen",
          zones: ["play"],
        },
        type: "gain-keyword",
      },
      id: "1ws-1",
      name: "INSPIRING VOICE",
      text: "INSPIRING VOICE Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: arielAdventurousCollectorEnchantedI18n,
};
