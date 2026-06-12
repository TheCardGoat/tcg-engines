import type { CharacterCard } from "@tcg/lorcana-types";
import { rafikiMysticalFighterI18n } from "./054-rafiki-mystical-fighter.i18n";
import { challenger } from "../../../helpers/abilities/challenger";

export const rafikiMysticalFighter: CharacterCard = {
  id: "YW7",
  canonicalId: "ci_s33",
  reprints: ["set3-054", "set9-036"],
  cardType: "character",
  name: "Rafiki",
  version: "Mystical Fighter",
  inkType: ["amethyst"],
  franchise: "Lion King",
  set: "003",
  cardNumber: 54,
  rarity: "rare",
  cost: 1,
  strength: 0,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_f0b125bab638401e834b91dc4577a894",
    tcgPlayer: 649983,
  },
  text: [
    {
      title: "Challenger +3",
    },
    {
      title: "ANCIENT SKILLS",
      description:
        "Whenever he challenges a Hyena character, this character takes no damage from the challenge.",
    },
  ],
  classifications: ["Dreamborn", "Mentor", "Sorcerer"],
  abilities: [
    challenger(3),
    {
      effect: {
        duration: "this-turn",
        replacement: {
          consumeOnApply: true,
          eventKinds: ["challenge-damage"],
          targetRef: "source",
          type: "prevent-damage",
        },
        type: "create-replacement-effect",
      },
      id: "w1t-2",
      name: "ANCIENT SKILLS",
      text: "ANCIENT SKILLS Whenever he challenges a Hyena character, this character takes no damage from the challenge.",
      trigger: {
        defender: {
          filters: [
            {
              type: "has-classification",
              classification: "Hyena",
            },
          ],
        },
        event: "challenge",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: rafikiMysticalFighterI18n,
};
