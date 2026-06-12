import type { ActionCard } from "@tcg/lorcana-types";
import { circleOfLifeI18n } from "./026-circle-of-life.i18n";

export const circleOfLife: ActionCard = {
  id: "SRg",
  canonicalId: "ci_gzm",
  reprints: ["set9-026"],
  cardType: "action",
  name: "Circle of Life",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "009",
  cardNumber: 26,
  rarity: "legendary",
  cost: 8,
  inkable: true,
  externalIds: {
    lorcast: "crd_ee377c93c09341fe808b8582cbded0f2",
    tcgPlayer: 649230,
  },
  text: [
    {
      title: "Sing Together 8",
      description:
        "(Any number of your or your teammates' characters with total cost 8 or more may {E} to sing this song for free.) Play a character from your discard for free.",
    },
  ],
  actionSubtype: "song",
  abilities: [
    {
      effect: {
        cardType: "character",
        cost: "free",
        from: "discard",
        target: "CHOSEN_CHARACTER",
        type: "play-card",
      },
      id: "1bo-1",
      text: "Sing Together 8 Play a character from your discard for free.",
      type: "action",
    },
  ],
  i18n: circleOfLifeI18n,
};
