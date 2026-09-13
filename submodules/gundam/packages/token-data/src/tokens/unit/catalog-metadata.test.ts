import { describe, expect, it } from "vite-plus/test";
import { tCharsZakuIi006 } from "./006-chars-zaku-ii.ts";
import { tZakuIi007 } from "./007-zaku-ii.ts";

describe("official token printing product metadata", () => {
  it.each([tCharsZakuIi006, tZakuIi007])(
    "keeps $cardNumber in the ST03 physical product while retaining its token identity",
    (token) => {
      expect(token.printings).toHaveLength(1);
      expect(token.printings[0]).toMatchObject({
        id: token.cardNumber,
        cardNumber: token.cardNumber,
        setCode: "ST03",
        set: {
          code: "ST03",
          name: "Zeon's Rush [ST03]",
          packageId: "616003",
        },
      });
      expect(token.type).toBe("unit");
      expect(token.level).toBe(0);
      expect(token.cost).toBe(0);
    },
  );
});
