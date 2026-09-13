import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { forsakenStrike } from "./forsaken-strike.ts";
const textByColor = {
  yellow:
    "As an additional cost to play this, you may destroy up to 3 zombies you control and/or discard up to 3 zombies. Choose a mode for each zombie destroyed or discarded this way;\n- Create a Gate to i'Arathael token.\n- This gets +2{p}.\n- This gets go again.",
} as const;
export const forsakenStrikeI18n = defineFamilyI18n(forsakenStrike, {
  en: {
    name: "Forsaken Strike",
    abilities: {
      rewards: {
        modes: {
          gate: "Create a Gate to i’Arathael token.",
          power: "This gets +2{p}.",
          goAgain: "This gets go again.",
        },
      },
    },
    typeText: "Shadow Necromancer Action - Attack",
    text: (_parameter, color) => textByColor[color],
  },
});
export const { yellow: forsakenStrikeYellowI18n } = forsakenStrikeI18n.cards;
