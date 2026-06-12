import type { CharacterCard } from "@tcg/lorcana-types";
import { mickeyMouseSnowboardAceI18n } from "./091-mickey-mouse-snowboard-ace.i18n";

export const mickeyMouseSnowboardAce: CharacterCard = {
  id: "FDn",
  canonicalId: "ci_FDn",
  reprints: ["set11-091"],
  cardType: "character",
  name: "Mickey Mouse",
  version: "Snowboard Ace",
  inkType: ["emerald"],
  set: "011",
  cardNumber: 91,
  rarity: "uncommon",
  cost: 6,
  strength: 4,
  willpower: 6,
  lore: 2,
  inkable: false,
  externalIds: {
    lorcast: "crd_23f005944c784e158b9709de1c587d1e",
    tcgPlayer: 673081,
  },
  text: [
    {
      title: "SLIPPERY SLOPE",
      description:
        "When you play this character and when he leaves play, each opponent chooses and discards a card.",
    },
  ],
  classifications: ["Dreamborn", "Hero"],
  abilities: [
    {
      id: "720-1",
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      name: "SLIPPERY SLOPE",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "SLIPPERY SLOPE When you play this character and when he leaves play, each opponent chooses and discards a card.",
    },
    {
      id: "720-2",
      effect: {
        amount: 1,
        chosen: true,
        target: "EACH_OPPONENT",
        type: "discard",
      },
      name: "SLIPPERY SLOPE",
      trigger: {
        event: "leave-play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
      text: "SLIPPERY SLOPE When you play this character and when he leaves play, each opponent chooses and discards a card.",
    },
  ],
  i18n: mickeyMouseSnowboardAceI18n,
};
