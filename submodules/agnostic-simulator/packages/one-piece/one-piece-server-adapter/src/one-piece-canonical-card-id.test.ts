import { describe, expect, it } from "vite-plus/test";
import { getAllCards } from "@tcg/op-cards";
import { onePieceServerAdapter } from "./adapter.js";

describe("onePieceServerAdapter.getCanonicalCardId", () => {
  it("resolves card and printing ids to canonical ids", () => {
    const card = getAllCards().find((candidate) => candidate.printings.length > 1);
    expect(card).toBeTruthy();

    expect(onePieceServerAdapter.getCanonicalCardId(card!.id)).toBe(card!.canonicalId);
    expect(onePieceServerAdapter.getCanonicalCardId(card!.printings[1]!.id)).toBe(
      card!.canonicalId,
    );
  });

  it("returns null for unknown ids", () => {
    expect(onePieceServerAdapter.getCanonicalCardId("not-a-real-op-id")).toBeNull();
  });
});
