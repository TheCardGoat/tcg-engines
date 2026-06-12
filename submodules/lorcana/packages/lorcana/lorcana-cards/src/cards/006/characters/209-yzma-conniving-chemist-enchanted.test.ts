import { describe, expect, it } from "bun:test";
import { yzmaConnivingChemist } from "./056-yzma-conniving-chemist";
import { yzmaConnivingChemistEnchanted } from "./209-yzma-conniving-chemist-enchanted";

describe("Yzma - Conniving Chemist Enchanted", () => {
  it("has the same ability payload as the base card", () => {
    const baseAbilities = yzmaConnivingChemist.abilities ?? [];
    const enchantedAbilities = yzmaConnivingChemistEnchanted.abilities ?? [];

    expect(enchantedAbilities).toHaveLength(baseAbilities.length);
    expect(enchantedAbilities.map((ability) => ability.name)).toEqual(
      baseAbilities.map((ability) => ability.name),
    );
    expect(enchantedAbilities.map((ability) => ability.text)).toEqual(
      baseAbilities.map((ability) => ability.text),
    );
  });
});
