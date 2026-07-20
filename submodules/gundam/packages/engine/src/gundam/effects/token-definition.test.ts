import { describe, expect, it } from "vite-plus/test";
import type { TokenSpec } from "@tcg/gundam-types";
import { TOKEN_PRINTINGS } from "@tcg/gundam-token-data";
import { buildTokenUnitDefinition } from "./token-definition.ts";

describe("buildTokenUnitDefinition", () => {
  it("never gives a token a color, even when presentation metadata has one", () => {
    const token: TokenSpec = {
      name: "Aile Strike Gundam",
      traits: ["earth alliance"],
      ap: 3,
      hp: 3,
      deployState: "active",
      printedCardNumber: "T-008",
      keywordEffects: [{ keyword: "Blocker" }],
    };
    const printed = { ...TOKEN_PRINTINGS["T-008"]!, color: "white" as const };

    expect(buildTokenUnitDefinition(token, "token-1", printed).color).toBeUndefined();
  });
});
