import type { ActionCard } from "@tcg/lorcana-types";
import { letItGoC2ChallengeI18n } from "./c2-010-let-it-go-challenge.i18n";

export const letItGoC2Challenge: ActionCard = {
  id: "wci",
  canonicalId: "ci_xdR",
  slug: "lorcana-ci_xdR",
  printings: [
    {
      id: "set1-c2-010-challenge",
      artId: "ci_xdR-challenge",
      setCode: "set1",
      collectorNumber: "10",
      rarity: "challenge",
      imageUrl: "",
    },
  ],
  reprints: ["set1-163", "set11-163"],
  cardType: "action",
  name: "Let It Go",
  inkType: ["sapphire"],
  franchise: "Frozen",
  set: "001",
  cardNumber: 10,
  rarity: "special",
  specialRarity: "challenge",
  cost: 5,
  inkable: true,
  externalIds: {
    lorcast: "crd_7e294ae586f24eddae3b7d1263c73ee7",
    tcgPlayer: "674692",
  },
  text: "Put chosen character into their player's inkwell facedown and exerted.",
  actionSubtype: "song",
  abilities: [
    {
      type: "action",
      effect: {
        type: "put-into-inkwell",
        source: "chosen-character",
        target: "CHOSEN_CHARACTER",
        facedown: true,
        exerted: true,
      },
    },
  ],
  i18n: letItGoC2ChallengeI18n,
};
