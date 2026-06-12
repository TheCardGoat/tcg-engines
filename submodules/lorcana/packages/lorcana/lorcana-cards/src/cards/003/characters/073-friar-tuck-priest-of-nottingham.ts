import type { CharacterCard } from "@tcg/lorcana-types";
import { friarTuckPriestOfNottinghamI18n } from "./073-friar-tuck-priest-of-nottingham.i18n";

export const friarTuckPriestOfNottingham: CharacterCard = {
  id: "29m",
  canonicalId: "ci_29m",
  reprints: ["set3-073"],
  cardType: "character",
  name: "Friar Tuck",
  version: "Priest of Nottingham",
  inkType: ["emerald"],
  franchise: "Robin Hood",
  set: "003",
  cardNumber: 73,
  rarity: "uncommon",
  cost: 4,
  strength: 2,
  willpower: 4,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_f6b07239b4384329b151160a80691d1b",
    tcgPlayer: 539080,
  },
  text: [
    {
      title: "YOU THIEVING SCOUNDREL",
      description:
        "When you play this character, the player or players with the most cards in their hand chooses and discards a card.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      effect: {
        amount: 1,
        chosen: true,
        from: "hand",
        target: {
          selector: "each-player",
          filter: {
            type: "zone-count-rank",
            zone: "hand",
            rank: "highest",
            ties: "all",
            minCount: 1,
          },
        },
        type: "discard",
      },
      id: "f7m-1",
      name: "YOU THIEVING SCOUNDREL",
      text: "YOU THIEVING SCOUNDREL When you play this character, the player or players with the most cards in their hand chooses and discards a card.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: friarTuckPriestOfNottinghamI18n,
};
