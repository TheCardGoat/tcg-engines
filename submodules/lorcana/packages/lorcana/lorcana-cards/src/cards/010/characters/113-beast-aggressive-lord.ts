import type { CharacterCard } from "@tcg/lorcana-types";
import { boost } from "../../../helpers/abilities/boost";
import { beastAggressiveLordI18n } from "./113-beast-aggressive-lord.i18n";

export const beastAggressiveLord: CharacterCard = {
  id: "xQ9",
  canonicalId: "ci_xQ9",
  reprints: ["set10-113"],
  cardType: "character",
  name: "Beast",
  version: "Aggressive Lord",
  inkType: ["ruby"],
  franchise: "Beauty and the Beast",
  set: "010",
  cardNumber: 113,
  rarity: "uncommon",
  cost: 2,
  strength: 3,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_4686c4ed63c846719806ece46f1cc106",
    tcgPlayer: 658324,
  },
  text: [
    {
      title: "Boost 2 {I}",
    },
    {
      title: "THAT'S MINE",
      description:
        "Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Hero", "Prince", "Whisper"],
  abilities: [
    boost(2),
    {
      effect: {
        type: "conditional",
        condition: {
          type: "has-card-under",
        },
        then: {
          type: "sequence",
          steps: [
            {
              amount: 1,
              target: "EACH_OPPONENT",
              type: "lose-lore",
            },
            {
              amount: 1,
              type: "gain-lore",
            },
          ],
        },
      },
      id: "6u1-2",
      name: "THAT'S MINE",
      text: "THAT'S MINE Whenever he challenges another character, if there's a card under this character, each opponent loses 1 lore and you gain 1 lore.",
      trigger: {
        event: "challenge",
        on: "SELF",
        timing: "whenever",
        // Printed text: "Whenever he challenges ANOTHER CHARACTER...".
        // Without this restriction, the +1/-1 lore transfer fires when Beast
        // challenges a location too (player report 2026-05-06: "Beast
        // challenged my Pizza Planet location. I lost one Lore and my
        // opponent gained one Lore. Since Beast challenged a location, this
        // should not have happened.").
        restrictions: [{ type: "defender-is-character" }],
      },
      type: "triggered",
    },
  ],
  i18n: beastAggressiveLordI18n,
};
