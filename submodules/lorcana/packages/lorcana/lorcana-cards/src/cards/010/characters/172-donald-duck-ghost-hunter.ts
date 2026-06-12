import type { CharacterCard } from "@tcg/lorcana-types";
import { donaldDuckGhostHunterI18n } from "./172-donald-duck-ghost-hunter.i18n";

export const donaldDuckGhostHunter: CharacterCard = {
  id: "8QA",
  canonicalId: "ci_8QA",
  reprints: ["set10-172"],
  cardType: "character",
  name: "Donald Duck",
  version: "Ghost Hunter",
  inkType: ["steel"],
  set: "010",
  cardNumber: 172,
  rarity: "common",
  cost: 4,
  strength: 5,
  willpower: 4,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_54826b5dca034c2d8afd142a96fedf58",
    tcgPlayer: 659396,
  },
  text: [
    {
      title: "RAISE A RUCKUS",
      description:
        "When you play this character, chosen Detective character gains Challenger +2 this turn. (They get +2 {S} while challenging.)",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Detective"],
  abilities: [
    {
      effect: {
        duration: "this-turn",
        keyword: "Challenger",
        target: {
          selector: "chosen",
          count: 1,
          owner: "any",
          zones: ["play"],
          cardTypes: ["character"],
          filter: [
            {
              type: "has-classification",
              classification: "Detective",
            },
          ],
        },
        type: "gain-keyword",
        value: 2,
      },
      id: "1u3-1",
      name: "RAISE A RUCKUS",
      text: "RAISE A RUCKUS When you play this character, chosen Detective character gains Challenger +2 this turn.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: donaldDuckGhostHunterI18n,
};
