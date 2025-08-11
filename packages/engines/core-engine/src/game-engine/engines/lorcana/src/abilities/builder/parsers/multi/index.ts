import { parseMultiEffectPatterns as legacySupport } from "../multiEffect";
import { parseBanishThenDraw } from "./banishDraw";
import { parseDamageThenDraw } from "./damageDraw";
import { parseHealThenDraw } from "./healDraw";
import { parseLoreCombo } from "./loreCombo";
import { parseLoreThenDraw } from "./loreDraw";
import { parseReadyAllThenRestrict } from "./readyRestrict";
import { parseStatThenAbility } from "./statAbility";
import { parseStatThenDraw } from "./statDraw";

export function parseMulti(text: string) {
  return (
    legacySupport(text) ||
    parseDamageThenDraw(text) ||
    parseHealThenDraw(text) ||
    parseBanishThenDraw(text) ||
    parseStatThenDraw(text) ||
    parseLoreCombo(text) ||
    parseStatThenAbility(text) ||
    parseLoreThenDraw(text) ||
    parseReadyAllThenRestrict(text) ||
    null
  );
}
