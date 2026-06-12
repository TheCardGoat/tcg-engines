import type { CharacterCard } from "@tcg/lorcana-types";
import { thaddeusEKlangMetallicLeaderI18n } from "./194-thaddeus-e-klang-metallic-leader.i18n";

export const thaddeusEKlangMetallicLeader: CharacterCard = {
  id: "iyr",
  canonicalId: "ci_iyr",
  reprints: ["set3-194"],
  cardType: "character",
  name: "Thaddeus E. Klang",
  version: "Metallic Leader",
  inkType: ["steel"],
  franchise: "Talespin",
  set: "003",
  cardNumber: 194,
  rarity: "uncommon",
  cost: 5,
  strength: 3,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_810ae6612d094f8a89c5db907d193cf5",
    tcgPlayer: 539116,
  },
  text: [
    {
      title: "MY TEETH ARE SHARPER",
      description:
        "Whenever this character quests while at a location, you may deal 1 damage to chosen character.",
    },
  ],
  classifications: ["Storyborn", "Villain"],
  abilities: [
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          amount: 1,
          target: {
            selector: "chosen",
            count: 1,
            owner: "any",
            zones: ["play"],
            cardTypes: ["character"],
          },
          type: "deal-damage",
        },
        type: "optional",
      },
      id: "195-1",
      name: "MY TEETH ARE SHARPER",
      text: "MY TEETH ARE SHARPER Whenever this character quests while at a location, you may deal 1 damage to chosen character.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      condition: {
        type: "target-query",
        query: {
          filters: [
            {
              type: "at-location",
            },
          ],
          reference: "trigger-subject",
          selector: "all",
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      type: "triggered",
    },
  ],
  i18n: thaddeusEKlangMetallicLeaderI18n,
};
