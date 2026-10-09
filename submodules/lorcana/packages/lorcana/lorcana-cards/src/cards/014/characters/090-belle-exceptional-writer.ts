import type { CharacterCard } from "@tcg/lorcana-types";
import { shift } from "../../../helpers/abilities/shift";
import { belleExceptionalWriterI18n } from "./090-belle-exceptional-writer.i18n";

export const belleExceptionalWriter: CharacterCard = {
  id: "jz8",
  canonicalId: "ci_jz8",
  slug: "lorcana-ci_jz8",
  printings: [
    {
      id: "set14-090",
      artId: "set14-090",
      setCode: "set14",
      collectorNumber: "90",
      rarity: "legendary",
      imageUrl: "",
    },
  ],
  reprints: ["set14-090"],
  cardType: "character",
  name: "Belle",
  version: "Exceptional Writer",
  inkType: ["emerald"],
  franchise: "Beauty and the Beast",
  set: "014",
  cardNumber: 90,
  rarity: "legendary",
  cost: 5,
  strength: 4,
  willpower: 5,
  lore: 2,
  inkable: true,
  text: [
    {
      title: "Shift 3 {I}",
    },
    {
      title: "Hyperia City Tips",
      description:
        "During your turn, whenever this character exerts, you pay 2 {I} less for the next action you play this turn.",
    },
    {
      title: "Hyperia City Secrets",
      description: "During your turn, whenever you play a third action, gain 3 lore.",
    },
  ],
  classifications: ["Dreamborn", "Hero", "Princess"],
  abilities: [
    shift(3),
    {
      id: "jz8-1",
      name: "Hyperia City Tips",
      type: "triggered",
      text: "Hyperia City Tips During your turn, whenever this character exerts, you pay 2 {I} less for the next action you play this turn.",
      trigger: {
        event: "exert",
        on: "SELF",
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }],
      },
      effect: {
        type: "cost-reduction",
        amount: 2,
        cardType: "action",
        duration: "next-play-this-turn",
        target: "CONTROLLER",
      },
    },
    {
      id: "jz8-2",
      name: "Hyperia City Secrets",
      type: "triggered",
      text: "Hyperia City Secrets During your turn, whenever you play a third action, gain 3 lore.",
      trigger: {
        event: "play",
        on: {
          cardType: "action",
          controller: "you",
        },
        timing: "whenever",
        restrictions: [{ type: "during-turn", whose: "your" }],
      },
      condition: {
        type: "turn-metric",
        metric: "played-actions",
        comparison: {
          operator: "eq",
          value: 3,
        },
      },
      effect: {
        type: "gain-lore",
        amount: 3,
        target: "CONTROLLER",
      },
    },
  ],
  i18n: belleExceptionalWriterI18n,
};
