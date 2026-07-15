import type { CharacterCard } from "@tcg/op-types";
import { op09BennBeckman009 } from "../../OP09/characters/009-benn-beckman.ts";
import { op13BennBeckmanSp009I18n } from "./009-benn-beckman-sp.i18n.ts";

export const op13BennBeckmanSp009: CharacterCard = {
  ...op09BennBeckman009,
  id: "OP09-009_p3_b28gAmg",
  slug: "benn-beckman-sp",
  name: "Benn.Beckman (SP)",
  printings: [
    {
      id: "OP09-009_p3_b28gAmg",
      artId: "OP09-009_p3_b28gAmg",
      setCode: "OP13",
      collectorNumber: "009",
      rarity: "SR",
      imageUrl: "https://www.optcgapi.com/media/static/Card_Images/OP09-009_p3_b28gAmg.png",
    },
  ],
  rarity: "SR",
  setId: "OP13",
  artVariants: undefined,
  i18n: op13BennBeckmanSp009I18n,
};
