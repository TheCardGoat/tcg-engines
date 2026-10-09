import type { ActionCard } from "@tcg/lorcana-types";
import { flippantTauntI18n } from "./098-flippant-taunt.i18n";

export const flippantTaunt: ActionCard = {
  id: "IpT",
  canonicalId: "ci_IpT",
  slug: "lorcana-ci_IpT",
  printings: [
    {
      id: "set14-098",
      artId: "set14-098",
      setCode: "set14",
      collectorNumber: "98",
      rarity: "common",
      imageUrl: "",
    },
  ],
  reprints: ["set14-098"],
  cardType: "action",
  name: "Flippant Taunt",
  inkType: ["emerald"],
  franchise: "Talespin",
  set: "014",
  cardNumber: 98,
  rarity: "common",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_9b97ce9d348d470682c87e873d65c213",
  },
  text: "Until the start of your next turn, chosen opposing character gains Reckless and, if you have 2 or more opponents, can't challenge your characters or locations. (They can't quest and must challenge if able.)",
  abilities: [
    {
      type: "action",
      text: "Until the start of your next turn, chosen opposing character gains Reckless and, if you have 2 or more opponents, can't challenge your characters or locations.",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "gain-keyword",
            keyword: "Reckless",
            duration: "until-start-of-next-turn",
            target: {
              selector: "chosen",
              count: 1,
              owner: "opponent",
              zones: ["play"],
              cardTypes: ["character"],
            },
          },
          {
            type: "conditional",
            condition: {
              type: "opponent-count",
              comparison: "greater-or-equal",
              value: 2,
            },
            then: {
              type: "restriction",
              restriction: "cant-challenge",
              defenderPlayers: "CONTROLLER",
              target: { ref: "previous-target" },
              duration: "until-start-of-next-turn",
            },
          },
        ],
      },
    },
  ],
  i18n: flippantTauntI18n,
};
