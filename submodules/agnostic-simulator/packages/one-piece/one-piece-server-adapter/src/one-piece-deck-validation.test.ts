import { describe, expect, it } from "vite-plus/test";
import { onePieceServerAdapter } from "./adapter.js";

const leader = { cardId: "OP01-001", quantity: 1 };

function copyLimitRule(cardId: string, quantity: number) {
  const result = onePieceServerAdapter.validateDeckForFormat("standard", [
    leader,
    { cardId, quantity },
  ]);
  return {
    result,
    rule: result.rules.find((candidate) => candidate.kind === "copy-limit"),
  };
}

describe("One Piece deck copy limits", () => {
  it("rejects more than four copies of an ordinary card", () => {
    const { result, rule } = copyLimitRule("OP01-004", 5);

    expect(result.valid).toBe(false);
    expect(rule).toMatchObject({ passed: false });
  });

  it("allows any number when the card definition has the unlimited-copies rule", () => {
    const { result, rule } = copyLimitRule("OP01-075", 20);

    expect(result.valid).toBe(true);
    expect(rule).toMatchObject({ passed: true });
  });
});
