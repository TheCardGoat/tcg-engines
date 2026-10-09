import { expect, test } from "vite-plus/test";
import { buildCardEffects } from "../../src/effect-parser/build-effects.ts";
import { parseLeaderCondition } from "../../src/effect-parser/condition-parser/leader.ts";
import { matchesTrait, normalizeTraits } from "../../../../packages/utils/src/traits.ts";

test("verified types keep Former Navy and Neo Navy distinct", () => {
  expect(normalizeTraits(["Donquixote Pirates Navy"])).toEqual(["Navy", "Donquixote Pirates"]);
  expect(normalizeTraits(["Former Navy East Blue"])).toEqual(["East Blue", "Former Navy"]);
  expect(normalizeTraits(["Film Neo Navy"])).toEqual(["FILM", "Neo Navy"]);
  expect(normalizeTraits(["Unknown Long Type"])).toEqual(["Unknown Long Type"]);
  expect(matchesTrait(["Donquixote Pirates Navy"], "Navy")).toBe(true);
  expect(matchesTrait(["Former Navy East Blue"], "Navy")).toBe(false);
  expect(matchesTrait(["FILM Neo Navy"], "Navy")).toBe(false);
  expect(matchesTrait(["Former Navy"], "Navy", "includes")).toBe(true);
});
test("ordinary Navy search generates exact matching", () => {
  const effects = buildCardEffects(
    "[On Play] Look at 3 cards from the top of your deck; reveal up to 1 [Navy] type card other than [Brannew] and add it to your hand. Then, trash the rest.",
  );
  expect(JSON.stringify(effects)).toContain('"value":"Navy","match":"exact"');
});
test("ordinary Leader conditions differ from explicit type-includes wording", () => {
  expect(parseLeaderCondition("your Leader has the {Navy} type")).toEqual({
    condition: "leaderTrait",
    trait: "Navy",
    match: "exact",
  });
  expect(parseLeaderCondition('your Leader\'s type includes "Navy"')).toEqual({
    condition: "leaderTrait",
    trait: "Navy",
    match: "includes",
  });
  expect(
    parseLeaderCondition('your Leader has the {Navy} type or a type including "Navy"'),
  ).toMatchObject({ conditions: [{ match: "exact" }, { match: "includes" }] });
});
test("explicit type-including search keeps substring matching", () => {
  const effects = buildCardEffects(
    '[On Play] Look at 3 cards from the top of your deck; reveal up to 1 card with a type including "Navy" and add it to your hand. Then, trash the rest.',
  );
  expect(JSON.stringify(effects)).toContain('"value":"Navy","match":"includes"');
});

test.each(["Animal", "Straw Hat Crew", "CP", "Rocks Pirates", "Whitebeard Pirates"])(
  "ordinary %s types and explicit including remain distinct in generated searches",
  (trait) => {
    const ordinary = buildCardEffects(
      `[On Play] Look at 3 cards from the top of your deck; reveal up to 1 [${trait}] type card and add it to your hand. Then, trash the rest.`,
    );
    const included = buildCardEffects(
      `[On Play] Look at 3 cards from the top of your deck; reveal up to 1 card with a type including "${trait}" and add it to your hand. Then, trash the rest.`,
    );
    expect(ordinary?.effects?.[0]?.actions[0]).toMatchObject({
      action: "search",
      revealFilters: expect.arrayContaining([{ filter: "trait", value: trait, match: "exact" }]),
    });
    expect(included?.effects?.[0]?.actions[0]).toMatchObject({
      action: "search",
      revealFilters: expect.arrayContaining([{ filter: "trait", value: trait, match: "includes" }]),
    });
  },
);

test("mixed ordinary and including trash costs retain each wording", () => {
  expect(
    buildCardEffects(
      "[Activate:Main] You may trash 1 [Animal] type card from your hand: Draw 1 card.",
    )?.effects?.[0]?.costs,
  ).toEqual([
    {
      cost: "trashFromHand",
      amount: 1,
      filters: [{ filter: "trait", value: "Animal", match: "exact" }],
    },
  ]);
  expect(
    buildCardEffects(
      '[Activate:Main] You may trash 1 card with a type including "CP" from your hand: Draw 1 card.',
    )?.effects?.[0]?.costs,
  ).toEqual([
    {
      cost: "trashFromHand",
      amount: 1,
      filters: [{ filter: "trait", value: "CP", match: "includes" }],
    },
  ]);
});
