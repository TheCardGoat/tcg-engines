import { defineFamilyI18n } from "../../authoring/family-i18n.ts";
import { skitteringSands } from "./skittering-sands.ts";

export const skitteringSandsI18n = defineFamilyI18n(skitteringSands, {
  en: {
    name: "Skittering Sands",
    text: ({ value1 }) =>
      `Transform target ash you control into an Aether Ashwing. It gains +${value1}{p} until end of turn.
Go again`,
    typeText: "Draconic Illusionist Action",
  },
});

export const {
  red: skitteringSandsRedI18n,
  yellow: skitteringSandsYellowI18n,
  blue: skitteringSandsBlueI18n,
} = skitteringSandsI18n.cards;
