import type { ActionCard } from "@tcg/lorcana-types";

export const dontLetTheFrostbiteBite: ActionCard = {
  id: "cu3",
  cardType: "action",
  name: "Don't Let the Frostbite Bite",
  inkType: ["ruby"],
  franchise: "Frozen",
  set: "005",
  text: "Ready all your characters. They can't quest for the rest of this turn.",
  actionSubtype: "song",
  cost: 7,
  cardNumber: 129,
  inkable: true,
  externalIds: {
    ravensburger: "2e42cd9c7fabd5179439829be568bfd49bf41ac9",
  },
  abilities: [
    {
      id: "cu3-1",
      text: "Ready all your characters. They can't quest for the rest of this turn.",
      type: "action",
      effect: {
        type: "sequence",
        steps: [
          {
            type: "ready",
            target: {
              selector: "all",
              controller: "you",
            },
          },
          {
            type: "restriction",
            restriction: "cant-quest",
            target: {
              selector: "all",
              controller: "you",
            },
            duration: "this-turn",
          },
        ],
      },
    },
  ],
};
