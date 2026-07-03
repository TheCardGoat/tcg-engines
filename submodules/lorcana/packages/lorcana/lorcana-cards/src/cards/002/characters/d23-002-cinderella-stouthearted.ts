import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaStoutheartedD23I18n } from "./d23-002-cinderella-stouthearted.i18n";

import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";

export const cinderellaStoutheartedD23: CharacterCard = {
  id: "4ya",
  canonicalId: "ci_T3C",
  slug: "lorcana-ci_T3C",
  printings: [
    {
      id: "set2-d23-002",
      artId: "set2-d23-002",
      setCode: "set2",
      collectorNumber: "2",
      rarity: "special",
      imageUrl: "",
    },
  ],
  reprints: ["set2-d23-002", "set2-177"],
  cardType: "character",
  name: "Cinderella",
  version: "Stouthearted",
  inkType: ["steel"],
  franchise: "D23",
  set: "002",
  cardNumber: 2,
  rarity: "special",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_8de3ae21bca6455bb44da9803af19ea8",
    tcgPlayer: "559533",
  },
  text: [
    {
      title: "<Shift> 5",
    },
    {
      title: "<Resist> +2",
    },
    {
      title: "The Singing Sword",
      description:
        "Whenever you play a song, this character may challenge ready characters this turn.",
    },
  ],
  classifications: ["Floodborn", "Hero", "Princess", "Knight"],
  abilities: [
    shift(5),
    resist(2),
    {
      id: "172-3",
      name: "THE SINGING SWORD",
      text: "THE SINGING SWORD Whenever you play a song, this character may challenge ready characters this turn.",
      type: "triggered",
      trigger: {
        event: "play",
        on: {
          cardType: "song",
          controller: "you",
        },
        timing: "whenever",
      },
      effect: {
        ability: "can-challenge-ready",
        duration: "this-turn",
        target: "SELF",
        type: "grant-ability",
      },
    },
  ],
  i18n: cinderellaStoutheartedD23I18n,
};
