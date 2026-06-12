import type { CharacterCard } from "@tcg/lorcana-types";
import { kakamoraMenacingSailorI18n } from "./111-kakamora-menacing-sailor.i18n";

export const kakamoraMenacingSailor: CharacterCard = {
  id: "rbY",
  canonicalId: "ci_rbY",
  reprints: ["set3-111"],
  cardType: "character",
  name: "Kakamora",
  version: "Menacing Sailor",
  inkType: ["ruby"],
  franchise: "Moana",
  set: "003",
  cardNumber: 111,
  rarity: "common",
  cost: 3,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: false,
  externalIds: {
    lorcast: "crd_d119988be09743af8639f30e658caa8c",
    tcgPlayer: 538365,
  },
  text: [
    {
      title: "PLUNDER",
      description: "When you play this character, each opponent loses 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Pirate"],
  abilities: [
    {
      effect: {
        amount: 1,
        target: "EACH_OPPONENT",
        type: "lose-lore",
      },
      id: "1xv-1",
      name: "PLUNDER",
      text: "PLUNDER When you play this character, each opponent loses 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: kakamoraMenacingSailorI18n,
};
