import { parseMultiEffectPatterns as legacySupport } from "../multiEffect";
import { parseBanishThenDraw } from "./banishDraw";
import { parseBanishOwnerGainsLore } from "./banishOwnerLore";
import { parseDamageThenDraw } from "./damageDraw";
import { parseDrawThenDiscard } from "./drawThenDiscard";
import { parseWardAndEvasiveUntilNextTurn } from "./grantCombined";
import { parseResistUntilNextThenDraw } from "./grantDraw";
import { parseHealThenDraw } from "./healDraw";
import { parseLoreCombo } from "./loreCombo";
import { parseLoreThenDraw } from "./loreDraw";
import { parseReadyAllThenRestrict } from "./readyRestrict";
import { parseRestrictThenDraw } from "./restrictDraw";
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
    parseDrawThenDiscard(text) ||
    parseRestrictThenDraw(text) ||
    parseResistUntilNextThenDraw(text) ||
    parseBanishOwnerGainsLore(text) ||
    parseWardAndEvasiveUntilNextTurn(text) ||
    null
  );
}
