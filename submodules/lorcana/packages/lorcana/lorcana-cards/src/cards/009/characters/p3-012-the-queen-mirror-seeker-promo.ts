import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenMirrorSeekerP3PromoI18n } from "./p3-012-the-queen-mirror-seeker-promo.i18n";

export const theQueenMirrorSeekerP3Promo: CharacterCard = {
  id: "xE1",
  canonicalId: "ci_h2q",
  slug: "lorcana-ci_h2q",
  printings: [
    {
      id: "set9-p3-012-promo",
      artId: "ci_h2q-promo",
      setCode: "set9",
      collectorNumber: "12",
      rarity: "promo",
      imageUrl: "",
    },
  ],
  reprints: ["set3-156", "set9-149"],
  cardType: "character",
  name: "The Queen",
  version: "Mirror Seeker",
  inkType: ["sapphire"],
  franchise: "Snow White",
  set: "009",
  cardNumber: 12,
  rarity: "special",
  specialRarity: "promo",
  cost: 4,
  strength: 2,
  willpower: 5,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_2124e542c7de4cadb69cb6e1887547ee",
    tcgPlayer: "650154",
  },
  text: [
    {
      title: "CALCULATING AND VAIN",
      description:
        "Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.",
    },
  ],
  classifications: ["Storyborn", "Villain", "Queen", "Sorcerer"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 3,
          destinations: [
            {
              zone: "deck-top",
              remainder: true,
              ordering: "player-choice",
            },
          ],
          target: "CONTROLLER",
          type: "scry",
        },
        type: "optional",
      },
      id: "fah-1",
      name: "CALCULATING AND VAIN",
      text: "CALCULATING AND VAIN Whenever this character quests, you may look at the top 3 cards of your deck and put them back in any order.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: theQueenMirrorSeekerP3PromoI18n,
};
