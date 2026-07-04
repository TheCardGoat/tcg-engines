import type { ItemCard } from "@tcg/lorcana-types";
import { powhatansStaffI18n } from "./036-powhatans-staff.i18n";

export const powhatansStaff: ItemCard = {
  id: "0mK",
  canonicalId: "ci_0mK",
  slug: "lorcana-ci_0mK",
  printings: [
    {
      id: "set13-036",
      artId: "set13-036",
      setCode: "set13",
      collectorNumber: "36",
      rarity: "uncommon",
      imageUrl: "",
    },
  ],
  reprints: ["set13-036"],
  cardType: "item",
  name: "Powhatan's Staff",
  inkType: ["amber"],
  franchise: "Pocahontas",
  set: "013",
  cardNumber: 36,
  rarity: "uncommon",
  cost: 1,
  inkable: true,
  externalIds: {
    lorcast: "crd_dbb2fd549bf5443689674a1c63ffe16c",
  },
  text: [
    {
      title: "STEP FORWARD",
      description:
        "{E}, 1 {I} — The next character you play this turn enters play exerted and gains Bodyguard until the start of your next turn. (An opposing character who challenges one of your characters must choose one with Bodyguard if able.)",
    },
  ],
  abilities: [
    {
      id: "0mK-1",
      name: "STEP FORWARD",
      type: "activated",
      cost: {
        exert: true,
        ink: 1,
      },
      effect: {
        type: "create-triggered-ability",
        lifecycle: {
          kind: "floating",
          duration: "this-turn",
        },
        ability: {
          id: "0mK-1-floating",
          name: "STEP FORWARD",
          autoResolve: true,
          trigger: {
            event: "play",
            on: {
              controller: "you",
              cardType: "character",
            },
            timing: "when",
            restrictions: [
              {
                type: "once-per-turn",
              },
            ],
          },
          effect: {
            type: "sequence",
            steps: [
              {
                type: "exert",
                target: {
                  ref: "trigger-subject",
                },
              },
              {
                type: "gain-keyword",
                keyword: "Bodyguard",
                duration: "until-start-of-next-turn",
                target: {
                  ref: "trigger-subject",
                },
              },
            ],
          },
        },
      },
      text: "STEP FORWARD {E}, 1 {I} - The next character you play this turn enters play exerted and gains Bodyguard until the start of your next turn.",
    },
  ],
  i18n: powhatansStaffI18n,
};
