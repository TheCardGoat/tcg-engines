import type { TriggeredAbility } from "@lorcanito/lorcana-engine/abilities/abilities";
import { atTheEndOfYourTurn } from "@lorcanito/lorcana-engine/abilities/atTheAbilities";
import type { CardEffectTarget } from "@lorcanito/lorcana-engine/effects/effectTargets";
import type {
  AbilityEffect,
  BanishEffect,
} from "@lorcanito/lorcana-engine/effects/effectTypes";
import type { LorcanaActionCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

const targetTriggerCard: CardEffectTarget = {
  type: "card",
  value: "all",
  filters: [{ filter: "source", value: "trigger" }],
};

const banishSelf: BanishEffect = {
  type: "banish",
  target: targetTriggerCard,
};

const atEndOfTurnBanishItself: TriggeredAbility = atTheEndOfYourTurn({
  effects: [banishSelf],
});

export const gruesomeAndGrim: LorcanaActionCardDefinition = {
  id: "zcv",
  name: "Gruesome And Grim",
  characteristics: ["action", "song"],
  text: "_A character with cost 3 or more can {E} to sing this song for free.)_\n\nPlay a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them. _(They can challenge the turn they're played.)_",
  type: "action",
  abilities: [
    {
      type: "resolution",
      name: "Gruesome And Grim",
      text: "Play a character with cost 4 or less for free. They gain **Rush**. At the end of the turn, banish them.",
      effects: [
        {
          type: "play",
          forFree: true,
          target: {
            type: "card",
            value: 1,
            filters: [
              { filter: "owner", value: "self" },
              { filter: "zone", value: "hand" },
              { filter: "type", value: "character" },
              {
                filter: "attribute",
                value: "cost",
                comparison: { operator: "lte", value: 4 },
              },
            ],
          },
        },
        {
          type: "ability",
          ability: "rush",
          modifier: "add",
          duration: "turn",
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "target" }],
          },
        } as AbilityEffect,
        {
          type: "ability",
          ability: "custom",
          modifier: "add",
          duration: "turn",
          customAbility: atEndOfTurnBanishItself,
          target: {
            type: "card",
            value: "all",
            filters: [{ filter: "source", value: "target" }],
          },
        } as AbilityEffect,
      ],
    },
  ],
  colors: ["amethyst"],
  cost: 3,
  illustrator: "Mariana Moreno",
  number: 62,
  set: "ROF",
  rarity: "rare",
};
