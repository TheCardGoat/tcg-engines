import type { CharacterCard } from "@tcg/lorcana-types";
import { theQueenMirrorSeekerEpicI18n } from "./219-the-queen-mirror-seeker-epic.i18n";

export const theQueenMirrorSeekerEpic: CharacterCard = {
  id: "HRY",
  canonicalId: "ci_h2q",
  slug: "lorcana-ci_h2q",
  printings: [
    {
      id: "set9-219-epic",
      artId: "ci_h2q-epic",
      setCode: "set9",
      collectorNumber: "219",
      rarity: "epic",
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
  cardNumber: 219,
  rarity: "common",
  specialRarity: "epic",
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
  i18n: theQueenMirrorSeekerEpicI18n,
};
