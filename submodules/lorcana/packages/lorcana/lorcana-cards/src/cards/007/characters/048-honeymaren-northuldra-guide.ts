import type { CharacterCard } from "@tcg/lorcana-types";
import { honeymarenNorthuldraGuideI18n } from "./048-honeymaren-northuldra-guide.i18n";

export const honeymarenNorthuldraGuide: CharacterCard = {
  id: "7Vg",
  canonicalId: "ci_7Vg",
  reprints: ["set7-048"],
  cardType: "character",
  name: "Honeymaren",
  version: "Northuldra Guide",
  inkType: ["amethyst"],
  franchise: "Frozen",
  set: "007",
  cardNumber: 48,
  rarity: "common",
  cost: 2,
  strength: 2,
  willpower: 2,
  lore: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_db6704b5f5e54a799f35d46afeca395d",
    tcgPlayer: 619432,
  },
  text: [
    {
      title: "TALE OF THE FIFTH SPIRIT",
      description:
        "When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
    },
  ],
  classifications: ["Storyborn", "Ally"],
  abilities: [
    {
      condition: {
        type: "target-query",
        query: {
          selector: "all",
          owner: "opponent",
          zones: ["play"],
          cardType: "character",
          filters: [
            {
              type: "exerted",
            },
          ],
        },
        comparison: {
          operator: "gte",
          value: 1,
        },
      },
      effect: {
        amount: 1,
        type: "gain-lore",
      },
      id: "1d4-1",
      name: "TALE OF THE FIFTH SPIRIT",
      text: "TALE OF THE FIFTH SPIRIT When you play this character, if an opponent has an exerted character in play, gain 1 lore.",
      trigger: {
        event: "play",
        on: "SELF",
        timing: "when",
      },
      type: "triggered",
    },
  ],
  i18n: honeymarenNorthuldraGuideI18n,
};
