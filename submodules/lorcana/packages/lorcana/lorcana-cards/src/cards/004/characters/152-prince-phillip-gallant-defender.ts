import type { CharacterCard } from "@tcg/lorcana-types";
import { princePhillipGallantDefenderI18n } from "./152-prince-phillip-gallant-defender.i18n";
import { support } from "../../../helpers/abilities/support";

export const princePhillipGallantDefender: CharacterCard = {
  id: "kbT",
  canonicalId: "ci_kbT",
  reprints: ["set4-152"],
  cardType: "character",
  name: "Prince Phillip",
  version: "Gallant Defender",
  inkType: ["sapphire"],
  franchise: "Sleeping Beauty",
  set: "004",
  cardNumber: 152,
  rarity: "rare",
  cost: 3,
  strength: 1,
  willpower: 3,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_02bb98b56ae0427abdd944699f1bda1c",
    tcgPlayer: 549517,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "BEST DEFENSE",
      description:
        "Whenever one of your characters is chosen for Support, they gain Resist +1 this turn.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    support,
    {
      effect: {
        duration: "this-turn",
        keyword: "Resist",
        target: { ref: "trigger-subject" },
        type: "gain-keyword",
        value: 1,
      },
      id: "1f7-2",
      name: "BEST DEFENSE",
      text: "BEST DEFENSE Whenever one of your characters is chosen for Support, they gain Resist +1 this turn.",
      trigger: {
        event: "support",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: princePhillipGallantDefenderI18n,
};
