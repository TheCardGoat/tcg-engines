import type { CharacterCard } from "@tcg/lorcana-types";
import { support } from "../../../helpers/abilities/support";
import { rapunzelReadyForAdventureI18n } from "./003-rapunzel-ready-for-adventure.i18n";

export const rapunzelReadyForAdventure: CharacterCard = {
  id: "8hR",
  canonicalId: "ci_8hR",
  reprints: ["set10-003"],
  cardType: "character",
  name: "Rapunzel",
  version: "Ready for Adventure",
  inkType: ["amber"],
  franchise: "Tangled",
  set: "010",
  cardNumber: 3,
  rarity: "legendary",
  cost: 2,
  strength: 1,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_70ae5f21fa1347b49ee910683e34d90e",
    tcgPlayer: 660274,
  },
  text: [
    {
      title: "Support",
    },
    {
      title: "ACT OF KINDNESS",
      description:
        "Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    support,
    {
      effect: {
        duration: "until-start-of-next-turn",
        replacement: {
          consumeOnApply: true,
          eventKinds: ["deal-damage", "challenge-damage"],
          targetRef: "trigger-subject",
          type: "prevent-damage",
        },
        type: "create-replacement-effect",
      },
      id: "8hR-2",
      name: "ACT OF KINDNESS",
      text: "ACT OF KINDNESS Whenever one of your characters is chosen for Support, until the start of your next turn, the next time they would be dealt damage they take no damage instead.",
      trigger: {
        event: "support",
        on: "YOUR_CHARACTERS",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rapunzelReadyForAdventureI18n,
};
