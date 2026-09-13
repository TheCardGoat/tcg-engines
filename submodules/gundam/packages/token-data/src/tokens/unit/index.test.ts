import { describe, expect, it } from "vite-plus/test";

import { TOKEN_PRINTINGS } from "./index.ts";

describe("TOKEN_PRINTINGS", () => {
  it("publishes Gundnode for simulator token previews", () => {
    const gundnode = TOKEN_PRINTINGS["T-026"];

    expect(gundnode).toMatchObject({
      cardNumber: "T-026",
      name: "Gundnode",
      imageUrl: "https://cdn.tcg.online/public/gundam/cards/t/T-026.webp",
    });
  });
});
