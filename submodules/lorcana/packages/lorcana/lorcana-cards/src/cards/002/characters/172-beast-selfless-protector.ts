import type { CharacterCard } from "@tcg/lorcana-types";
import { beastSelflessProtectorI18n } from "./172-beast-selfless-protector.i18n";

export const beastSelflessProtector: CharacterCard = {
  id: "sLs",
  canonicalId: "ci_sLs",
  reprints: ["set2-172"],
  cardType: "character",
  name: "Beast",
  version: "Selfless Protector",
  inkType: ["steel"],
  franchise: "Beauty and the Beast",
  set: "002",
  cardNumber: 172,
  rarity: "common",
  cost: 6,
  strength: 2,
  willpower: 8,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_966bd91d331f46b3af9f199a2e03515d",
    tcgPlayer: 527772,
  },
  text: [
    {
      title: "SHIELD ANOTHER",
      description:
        "Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince"],
  abilities: [
    {
      id: "sLs-1",
      name: "SHIELD ANOTHER",
      replaces: "damage-to-character",
      replacement: {
        type: "redirect-damage",
        appliesTo: "your-other-characters",
        redirectTo: "self",
      },
      text: "SHIELD ANOTHER Whenever one of your other characters would be dealt damage, put that many damage counters on this character instead.",
      type: "replacement",
    },
  ],
  i18n: beastSelflessProtectorI18n,
};
