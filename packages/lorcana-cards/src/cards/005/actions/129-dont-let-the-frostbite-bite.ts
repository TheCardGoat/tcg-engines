import type { ActionCard } from "@tcg/lorcana-types";

export const dontLetTheFrostbiteBite: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            target: {
              count: "all",
              filter: [{ owner: "you", type: "owner" }],
              selector: "all",
            },
            type: "ready",
          },
          {
            duration: "this-turn",
            restriction: "cant-quest",
            target: {
              count: "all",
              filter: [{ owner: "you", type: "owner" }],
              selector: "all",
            },
            type: "restriction",
          },
        ],
        type: "sequence",
      },
      id: "cu3-1",
      text: "Ready all your characters. They can't quest for the rest of this turn.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 129,
  cardType: "action",
  cost: 7,
  externalIds: {
    ravensburger: "2e42cd9c7fabd5179439829be568bfd49bf41ac9",
  },
  franchise: "Frozen",
  id: "cu3",
  inkType: ["ruby"],
  inkable: true,
  name: "Don't Let the Frostbite Bite",
  set: "005",
  text: "Ready all your characters. They can't quest for the rest of this turn.",
};
