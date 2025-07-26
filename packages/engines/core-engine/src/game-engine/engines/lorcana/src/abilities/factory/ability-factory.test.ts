import { describe, expect, it, test } from "bun:test";
import { AbilityBuilder } from "~/game-engine/engines/lorcana/src/abilities/factory/ability-builder.ts";
import type { SingerAbility } from "~/game-engine/engines/lorcana/src/abilities/keyword/singerAbility.ts";

const value = 5;

describe("AbilityFactory", () => {
  it("singer", () => {
    const actual = AbilityBuilder.fromText(
      `**Singer** ${value} _(This character counts as cost ${value} to sing songs.)_`,
    );
    const expected: SingerAbility[] = [
      {
        type: "keyword",
        keyword: "singer",
        value,
      },
    ];

    expect(actual).toEqual(expected);
  });
});
