import { duringYourTurn } from "@lorcanito/lorcana-engine/abilities/conditions/conditions";
import { yourOtherCharacters } from "@lorcanito/lorcana-engine/abilities/target";
import { putTopCardOfYourDeckIntoYourInkwellExerted } from "@lorcanito/lorcana-engine/effects/effects";
import { wheneverIsBanished } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const cruellaDeVilStyleIcon: LorcanitoCharacterCardDefinition = {
  id: "mpf",
  name: "Cruella De Vil",
  title: "Style Icon",
  characteristics: ["storyborn", "villain"],
  text: "OUT OF SEASON Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.\nINSULTING REMARK During your turn, each opposing character with cost 2 or less gets -1 {S}.",
  type: "character",
  inkwell: false,
  colors: ["sapphire"],
  cost: 3,
  strength: 2,
  willpower: 3,
  illustrator: "Juan Diego León",
  number: 143,
  set: "009",
  rarity: "common",
  abilities: [
    wheneverIsBanished({
      name: "Out of Season",
      text: "Once during your turn, whenever a character with cost 2 or less is banished, put the top card of your deck into your inkwell facedown and exerted.",
      effects: [putTopCardOfYourDeckIntoYourInkwellExerted],
      conditions: [duringYourTurn],
      oncePerTurn: true,
      filters: [
        { filter: "type", value: "character" },
        {
          filter: "attribute",
          value: "cost",
          comparison: { operator: "lte", value: 2 },
        },
      ],
    }),
    {
      type: "static",
      ability: "gain-ability",
      name: "INSULTING REMARK",
      text: "During your turn, each opposing character with cost 2 or less gets -1 {S}.",
      conditions: [duringYourTurn],
      gainedAbility: {
        type: "static",
        ability: "effects",
        name: "INSULTING REMARK",
        text: "This character gets -1 {S}.",
        conditions: [duringYourTurn],
        effects: [
          {
            type: "attribute",
            attribute: "strength",
            amount: 1,
            modifier: "subtract",
            target: {
              type: "card",
              value: "all",
              filters: [
                { filter: "type", value: "character" },
                { filter: "owner", value: "opponent" },
                {
                  filter: "attribute",
                  value: "cost",
                  comparison: { operator: "lte", value: 2 },
                },
              ],
            },
          },
        ],
      },
      target: yourOtherCharacters,
    },
  ],
  lore: 1,
};
