import type { UnitCardDefinition } from "../../card-types";

export const Zno: UnitCardDefinition = {
  id: "gd01-063",
  name: "ZnO",
  cardNumber: "GD01-063",
  setCode: "GD01",
  cardType: "UNIT",
  rarity: "uncommon",
  color: "red",
  level: 2,
  cost: 2,
  text: "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains &lt;First Strike&gt;.<br />
(While this Unit is attacking, it deals damage before the enemy Unit.)
",
  imageUrl: "../images/cards/card/GD01-063.webp?2510031",
  sourceTitle: "Mobile Suit Gundam SEED",
  ap: 2,
  hp: 1,
  zones: [
    "earth",
  ],
  traits: [
    "zaft",
  ],
  linkRequirements: [
    "(zaft)-trait",
  ],
  keywords: [
    {
      keyword: "First-Strike",
    },
  ],
  abilities: [
    {
      description: "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains <First Strike>.<br /> (While this Unit is attacking, it deals damage before the enemy Unit.)",
      effect: {
        type: "UNKNOWN",
        rawText: "During your turn, while this Unit is battling an enemy Unit that is Lv.2 or lower, it gains <First Strike>.<br /> (While this Unit is attacking, it deals damage before the enemy Unit.)",
      },
    },
  ],
};
