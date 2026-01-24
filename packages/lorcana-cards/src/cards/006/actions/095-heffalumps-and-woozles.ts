import type { ActionCard } from "@tcg/lorcana-types";

export const heffalumpsAndWoozles: ActionCard = {
  id: "10y",
  cardType: "action",
  name: "Heffalumps and Woozles",
  inkType: ["emerald"],
  franchise: "Winnie the Pooh",
  set: "006",
  text: "Chosen opposing character can't quest during their next turn. Draw a card.",
  actionSubtype: "song",
  cost: 2,
  cardNumber: 95,
  inkable: true,
  missingTests: true,
  externalIds: {
    ravensburger: "852f102ef952d51be8cdcfe9a21537a060be160a",
  },
  abilities: [
    {
      id: "10y-1",
      type: "action",
      effect: {
        type: "sequence",
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
      },
      text: "Chosen opposing character can't quest during their next turn. Draw a card.",
    },
  ],
};
