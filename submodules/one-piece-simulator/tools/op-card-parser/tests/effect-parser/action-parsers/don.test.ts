import { expect, test, describe } from "vite-plus/test";
import { buildCardEffects, parseActions } from "../../../src/effect-parser/index.ts";

describe("parseActions — AddDonAction", () => {
  test("Add 1 DON!! and rest it", () => {
    const result = parseActions("Add up to 1 DON!! card from your DON!! deck and rest it");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "addDon",
      count: { amount: 1, upTo: true },
      state: "rested",
    });
    expect(result.unparsed).toBe("");
  });

  test("Add 1 DON!! and set it as active", () => {
    const result = parseActions("Add up to 1 DON!! card from your DON!! deck and set it as active");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "addDon",
      count: { amount: 1, upTo: true },
      state: "active",
    });
    expect(result.unparsed).toBe("");
  });

  test("Add 2 DON!! cards and rest them", () => {
    const result = parseActions("add up to 2 DON!! cards from your DON!! deck and rest them");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "addDon",
      count: { amount: 2, upTo: true },
      state: "rested",
    });
  });

  test("Add 2 DON!! cards and set them as active", () => {
    const result = parseActions(
      "Add up to 2 DON!! cards from your DON!! deck and set them as active",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "addDon",
      count: { amount: 2, upTo: true },
      state: "active",
    });
  });

  test("trailing period is stripped", () => {
    const result = parseActions("Add up to 1 DON!! card from your DON!! deck and rest it.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "addDon", state: "rested" });
  });

  test("compound: addDon + draw", () => {
    const result = parseActions(
      "Add up to 1 DON!! card from your DON!! deck and rest it and draw 1 card",
    );
    expect(result.parsed).toHaveLength(2);
    expect(result.parsed[0]).toMatchObject({ action: "addDon", state: "rested" });
    expect(result.parsed[1]).toMatchObject({ action: "draw", amount: 1 });
  });

  test("buildCardEffects: [On Play] Add DON!!", () => {
    const result = buildCardEffects(
      "[On Play] Add up to 1 DON!! card from your DON!! deck and set it as active.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("onPlay");
    expect(block.actions[0]).toMatchObject({
      action: "addDon",
      count: { amount: 1, upTo: true },
      state: "active",
    });
  });
});

describe("parseActions — GiveDonAction", () => {
  test("Give 1 rested DON!! to your Leader or 1 of your Characters", () => {
    const result = parseActions(
      "Give up to 1 rested DON!! card to your Leader or 1 of your Characters",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toEqual({
      action: "giveDon",
      target: {
        player: "self",
        zones: ["leader", "character"],
        count: { amount: 1 },
      },
      count: { amount: 1, upTo: true },
      donState: "rested",
    });
    expect(result.unparsed).toBe("");
  });

  test("Give 2 rested DON!! cards to 1 of your Characters", () => {
    const result = parseActions("Give up to 2 rested DON!! cards to 1 of your Characters");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "giveDon",
      count: { amount: 2, upTo: true },
      target: {
        player: "self",
        zones: ["character"],
        count: { amount: 1 },
      },
    });
  });

  test("Give DON!! to your Leader (simple)", () => {
    const result = parseActions("Give up to 1 rested DON!! card to your Leader");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "giveDon",
      target: {
        player: "self",
        zones: ["leader"],
        count: { amount: 1 },
      },
    });
  });

  test("Give DON!! to trait-filtered Leader", () => {
    const result = parseActions(
      "Give up to 3 rested DON!! cards to your {Land of Wano} type Leader",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "giveDon",
      count: { amount: 3, upTo: true },
      target: {
        player: "self",
        zones: ["leader"],
        filters: [{ filter: "trait", value: "Land of Wano" }],
      },
    });
  });

  test("Give DON!! to trait-filtered Leader or Character", () => {
    const result = parseActions(
      "Give up to 1 rested DON!! card to 1 of your {Fish-Man} or {Merfolk} type Leader or Character cards",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "giveDon",
      target: { player: "self", zones: ["leader", "character"] },
    });
  });

  test("Give 2 DON!! to your Leader or 1 of your Characters", () => {
    const result = parseActions(
      "Give up to 2 rested DON!! cards to your Leader or 1 of your Characters",
    );
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "giveDon",
      count: { amount: 2, upTo: true },
    });
  });

  test("lowercase give", () => {
    const result = parseActions("give up to 2 rested DON!! cards to 1 of your Characters");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({ action: "giveDon" });
  });

  test("buildCardEffects: [When Attacking] give DON!!", () => {
    const result = buildCardEffects(
      "[When Attacking] Give up to 1 rested DON!! card to your Leader or 1 of your Characters.",
    );
    expect(result).toBeDefined();
    const block = result!.effects![0]!;
    expect(block.trigger).toBe("whenAttacking");
    expect(block.actions[0]).toMatchObject({
      action: "giveDon",
      count: { amount: 1, upTo: true },
      donState: "rested",
    });
  });
});

describe("parseActions — addDon typo fix", () => {
  test("Ad (single d) up to 1 DON!!", () => {
    const result = parseActions("Ad up to 1 DON!! card from your DON!! deck and set it as active.");
    expect(result.parsed).toHaveLength(1);
    expect(result.parsed[0]).toMatchObject({
      action: "addDon",
      count: { amount: 1, upTo: true },
      state: "active",
    });
  });
});
