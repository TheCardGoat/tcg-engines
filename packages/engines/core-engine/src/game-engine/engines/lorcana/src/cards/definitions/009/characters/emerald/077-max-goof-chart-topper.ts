import type {
  CardEffectTarget,
  LorcanitoCharacterCard,
  PlayEffect,
} from "@lorcanito/lorcana-engine";
import { shiftAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/shiftAbility";
import { wheneverThisCharacterQuests } from "~/game-engine/engines/lorcana/src/abilities/wheneverAbilities";

const songFromDiscard: CardEffectTarget = {
  type: "card",
  value: 1,
  filters: [
    { filter: "owner", value: "self" },
    { filter: "zone", value: "discard" },
    { filter: "characteristics", value: ["song"] },
    {
      filter: "attribute",
      value: "cost",
      ignoreBonuses: true,
      comparison: { operator: "lte", value: 4 },
    },
  ],
};

const playEffect: PlayEffect = {
  type: "play",
  forFree: true,
  bottomCardAfterPlaying: true,
  target: songFromDiscard,
};

export const maxGoofChartTopper: LorcanitoCharacterCardDefinition = {
  id: "o1c",
  // notImplemented: true,
  missingTestCase: false,
  name: "Max Goof",
  title: "Chart Topper",
  characteristics: ["floodborn", "hero"],
  text: "Shift 4\nNUMBER ONE HIT Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
  type: "character",
  inkwell: true,
  colors: ["emerald"],
  cost: 6,
  strength: 4,
  willpower: 5,
  illustrator: "Max Ulrichney",
  number: 77,
  set: "009",
  rarity: "legendary",
  abilities: [
    shiftAbility(4, "Max Goof"),
    wheneverThisCharacterQuests({
      name: "NUMBER ONE HIT",
      text: "Whenever this character quests, you may play a song card with cost 4 or less from your discard for free, then put it on the bottom of your deck instead of into your discard.",
      optional: true,
      effects: [playEffect],
    }),
  ],
  lore: 2,
};
