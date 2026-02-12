import type { ActionCard } from "@tcg/lorcana-types";

export const heffalumpsAndWoozles: ActionCard = {
  abilities: [
    {
      effect: {
        steps: [
          {
            type: "restriction",
            restriction: "cant-quest",
            target: "SELF",
            duration: "until-start-of-next-turn",
          },
          {
            type: "draw",
            amount: 1,
            target: "CONTROLLER",
          },
        ],
        type: "sequence",
      },
      id: "10y-1",
      text: "Chosen opposing character can't quest during their next turn. Draw a card.",
      type: "action",
    },
  ],
  actionSubtype: "song",
  cardNumber: 95,
  cardType: "action",
  cost: 2,
  externalIds: {
    ravensburger: "852f102ef952d51be8cdcfe9a21537a060be160a",
  },
  franchise: "Winnie the Pooh",
  id: "10y",
  inkType: ["emerald"],
  inkable: true,
  missingTests: true,
  name: "Heffalumps and Woozles",
  set: "006",
  text: "Chosen opposing character can't quest during their next turn. Draw a card.",
};
