import { revealTopOfDeckPutInHandOrDeck } from "@lorcanito/lorcana-engine/effects/effects";
import { thisCharacter } from "~/game-engine/engines/lorcana/src/abilities/targets";
import { wheneverQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";
import type { LorcanaCharacterCardDefinition } from "~/game-engine/engines/lorcana/src/cards/lorcana-card-repository";

export const sisuUnitingDragon: LorcanaCharacterCardDefinition = {
  id: "kkq",
  name: "Sisu",
  title: "Uniting Dragon",
  characteristics: ["storyborn", "hero", "deity", "dragon"],
  text: "TRUST BUILDS TRUST Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
  type: "character",
  abilities: [
    wheneverQuests({
      name: "Trust Builds Trust",
      text: "Whenever this character quests, reveal the top card of your deck. If it’s a Dragon character card, put it into your hand and repeat this effect. Otherwise, put it on either the top or the bottom of your deck.",
      effects: revealTopOfDeckPutInHandOrDeck({
        mode: "bottom",
        tutorFilters: [
          { filter: "type", value: "character" },
          { filter: "characteristics", value: ["dragon"] },
          { filter: "owner", value: "self" },
        ],
        onTargetMatchEffects: [
          {
            type: "create-layer-based-on-target",
            filters: [{ filter: "characteristics", value: ["dragon"] }],
            // TODO: get rid of target
            target: thisCharacter,
            effects: revealTopOfDeckPutInHandOrDeck({
              mode: "bottom",
              tutorFilters: [
                { filter: "type", value: "character" },
                { filter: "characteristics", value: ["dragon"] },
                { filter: "owner", value: "self" },
              ],
            }),
          },
        ],
      }),
    }),
  ],
  inkwell: false,
  colors: ["amethyst"],
  cost: 4,
  strength: 3,
  willpower: 3,
  lore: 2,
  illustrator: "Shannon Hallstein",
  number: 54,
  set: "006",
  rarity: "super_rare",
};
