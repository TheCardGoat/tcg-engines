import type { LorcanaKeywords } from "../../keyword/keyword";
import { AbilityBuilder } from "../ability-builder";
import { PATTERNS } from "./util";

export function parseKeyword(text: string) {
  const simpleMatch = text.match(PATTERNS.SIMPLE_KEYWORD);
  if (simpleMatch) {
    const keyword = simpleMatch[1].toLowerCase() as LorcanaKeywords;
    return AbilityBuilder.keyword(keyword, undefined, text);
  }

  const valueMatch = text.match(PATTERNS.KEYWORD_WITH_VALUE);
  if (valueMatch) {
    const [, keywordRaw, value] = valueMatch;
    let keyword: string = keywordRaw.toLowerCase();
    if (
      keyword.includes("sing") &&
      (keyword.includes("together") || keyword.includes(" together"))
    ) {
      keyword = "sing-together";
    }
    return AbilityBuilder.keyword(
      keyword as LorcanaKeywords,
      Number.parseInt(value, 10),
      text,
    );
  }
  return null;
}
