import type { CharacterCard } from "@tcg/lorcana-types";
import { maxGoofChartTopperI18n } from "./077-max-goof-chart-topper.i18n";

export const maxGoofChartTopper: CharacterCard = {
  id: "47m",
  canonicalId: "ci_DrO",
  reprints: ["set9-077"],
  cardType: "character",
  name: "Max Goof",
  version: "Chart Topper",
  inkType: ["emerald"],
  franchise: "Goofy Movie",
  set: "009",
  cardNumber: 77,
  rarity: "legendary",
  cost: 6,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  externalIds: {
    lorcast: "crd_b5087f60fdf4442686a00fb4243fcf48",
    tcgPlayer: 651113,
  },
  text: [
    {
      title: "Shift 4 {I}",
    },
    {
      title: "NUMBER ONE HIT",
      description:
        "Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
    },
  ],
  classifications: ["Floodborn", "Hero"],
  abilities: [
    {
      cost: {
        ink: 4,
      },
      id: "iz6-1",
      keyword: "Shift",
      text: "Shift 4 {I}",
      type: "keyword",
    },
    {
      effect: {
        chooser: "CONTROLLER",
        effect: {
          afterPlay: "bottom-of-deck",
          cardType: "song",
          cost: "free",
          filter: {
            cardType: "song",
            maxCost: 4,
          },
          from: "discard",
          type: "play-card",
        },
        type: "optional",
      },
      id: "iz6-2",
      name: "NUMBER ONE HIT",
      text: "NUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
      trigger: {
        event: "quest",
        on: "SELF",
        timing: "whenever",
      },
      type: "triggered",
    },
  ],
  i18n: maxGoofChartTopperI18n,
};
