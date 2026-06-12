import type { CharacterCard } from "@tcg/lorcana-types";
import { cinderellaStoutheartedI18n } from "./177-cinderella-stouthearted.i18n";
import { resist } from "../../../helpers/abilities/resist";
import { shift } from "../../../helpers/abilities/shift";

export const cinderellaStouthearted: CharacterCard = {
  id: "T3C",
  canonicalId: "ci_T3C",
  reprints: ["set2-177"],
  cardType: "character",
  name: "Cinderella",
  version: "Stouthearted",
  inkType: ["steel"],
  franchise: "Cinderella",
  set: "002",
  cardNumber: 177,
  rarity: "common",
  cost: 7,
  strength: 5,
  willpower: 5,
  lore: 3,
  inkable: true,
  externalIds: {
    lorcast: "crd_8de3ae21bca6455bb44da9803af19ea8",
    tcgPlayer: 559533,
  },
  text: [
    {
      title: "Shift 5",
    },
    {
      title: "Resist +2",
    },
    {
      title: "THE SINGING SWORD",
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
  i18n: cinderellaStoutheartedI18n,
};
