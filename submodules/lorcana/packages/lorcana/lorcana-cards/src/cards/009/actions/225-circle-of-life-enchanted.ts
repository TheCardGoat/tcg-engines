import type { ActionCard } from "@tcg/lorcana-types";
import { circleOfLifeEnchantedI18n } from "./225-circle-of-life-enchanted.i18n";

import { singTogether } from "../../../helpers/abilities/singTogether";

export const circleOfLifeEnchanted: ActionCard = {
  id: "1LV",
  canonicalId: "ci_gzm",
  slug: "lorcana-ci_gzm",
  printings: [
    {
      id: "set9-225-enchanted",
      artId: "ci_gzm-enchanted",
      setCode: "set9",
      collectorNumber: "225",
      rarity: "enchanted",
      imageUrl: "",
    },
  ],
  reprints: ["set9-026"],
  cardType: "action",
  name: "Circle of Life",
  inkType: ["amber"],
  franchise: "Lion King",
  set: "009",
  cardNumber: 225,
  rarity: "enchanted",
  specialRarity: "enchanted",
  cost: 8,
  inkable: true,
  externalIds: {
    lorcast: "crd_ee377c93c09341fe808b8582cbded0f2",
    tcgPlayer: "649230",
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
    singTogether(8),
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
  i18n: circleOfLifeEnchantedI18n,
};
