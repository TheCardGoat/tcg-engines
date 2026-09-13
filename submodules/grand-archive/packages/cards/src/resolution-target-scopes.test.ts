import { describe, expect, it } from "vitest";
import { compileGrandArchiveAbilities } from "../scripts/compile-card-abilities.ts";
import { scopeResolutionTargets } from "../scripts/scope-resolution-targets.ts";

function compile(rulesText: string) {
  return compileGrandArchiveAbilities({
    canonicalId: "scopeFixture",
    name: "Fixture",
    rulesText,
    types: ["ACTION"],
  });
}
describe("independent paragraph target bindings", () => {
  it("keeps conditional paragraph targets stable and leaves single-paragraph names unchanged", () => {
    const first = "Deal 2 damage to up to one target ally.";
    const result = compile(
      first + "\n\n[Class Bonus] Target ally you control gets +2 POWER until end of turn.",
    );
    expect(result.abilities[0]).toEqual(compile(first).abilities[0]);
    expect(result.abilities[1]).toMatchObject({
      targets: [{ id: "scopeFixture-a2:target-1" }],
      effect: { subjects: { kind: "bound", binding: "scopeFixture-a2:target-1" } },
      restrictions: [{ name: "class-bonus" }],
    });
  });
  it("scopes every later collision independently", () => {
    const result = compile(Array(3).fill("Deal 2 damage to up to one target unit.").join("\n\n"));
    for (const [i, ability] of result.abilities.entries()) {
      const id = i ? `scopeFixture-a${i + 1}:target-1` : "target-1";
      expect(ability).toMatchObject({ targets: [{ id }], effect: { recipient: { binding: id } } });
    }
  });
  it("refuses an unhandled reference instead of leaving a stale binding", () => {
    const [ability] = compile("Deal 2 damage to target ally.").abilities;
    if (ability?.kind !== "card-resolution") throw new Error("Expected a resolution");
    expect(
      scopeResolutionTargets([
        ability,
        {
          ...ability,
          id: "scopeFixture-a2",
          effect: {
            kind: "draw",
            player: "controller",
            amount: {
              kind: "property",
              subject: { kind: "bound", binding: "target-1" },
              property: "power",
              basis: "current",
            },
          },
        },
      ]),
    ).toMatchObject([
      {},
      { kind: "unparsed", id: "scopeFixture-a2", unparsedSegments: [ability.text] },
    ]);
  });
});

it("records unsupported nested selection scoping as a local gap without aborting compilation", () => {
  const [first] = compile("Deal 2 damage to target ally.").abilities;
  if (first?.kind !== "card-resolution" || !first.targets?.[0]) throw new Error("Expected target");
  const result = scopeResolutionTargets([
    first,
    {
      ...first,
      id: "scopeFixture-a2",
      effect: {
        kind: "choose",
        selection: { ...first.targets[0], kind: "choice", declared: "resolution" },
        effect: first.effect,
      },
    },
    { ...first, id: "scopeFixture-a3" },
  ]);
  expect(result[0]).toEqual(first);
  expect(result[1]).toMatchObject({
    kind: "unparsed",
    id: "scopeFixture-a2",
    unparsedSegments: [first.text],
  });
  expect(result[2]).toMatchObject({
    kind: "card-resolution",
    targets: [{ id: "scopeFixture-a3:target-1" }],
  });
});
