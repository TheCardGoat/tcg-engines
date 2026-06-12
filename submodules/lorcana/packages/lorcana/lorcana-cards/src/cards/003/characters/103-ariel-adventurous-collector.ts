import type { CharacterCard } from "@tcg/lorcana-types";
import { arielAdventurousCollectorI18n } from "./103-ariel-adventurous-collector.i18n";
import { evasive } from "../../../helpers/abilities/evasive";

export const arielAdventurousCollector: CharacterCard = {
  id: "pA8",
  canonicalId: "ci_6BB",
  reprints: ["set3-103", "set9-107"],
  cardType: "character",
  name: "Ariel",
  version: "Adventurous Collector",
  inkType: ["ruby"],
  franchise: "Little Mermaid",
  set: "003",
  cardNumber: 103,
  rarity: "common",
  cost: 3,
  strength: 2,
  willpower: 3,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_e6a1d03334964fb78033020d86a5f502",
    tcgPlayer: 651123,
  },
  text: [
    {
      title: "Evasive",
    },
    {
      title: "INSPIRING VOICE",
      description:
        "Whenever you play a song, chosen character of yours gains Evasive until the start of your next turn.",
    },
  ],
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
  i18n: arielAdventurousCollectorI18n,
};
