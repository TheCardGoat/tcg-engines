import { describe, expect, it } from "bun:test";
import { goliathClanLeader } from "./173-goliath-clan-leader";
import { goliathClanLeaderEnchanted } from "./238-goliath-clan-leader-enchanted";

describe("Goliath - Clan Leader - Enchanted", () => {
  it("keeps the same named abilities as the base card", () => {
    const baseNames = goliathClanLeader.abilities?.map((ability) => ability.name) ?? [];
    const enchantedNames =
      goliathClanLeaderEnchanted.abilities?.map((ability) => ability.name) ?? [];

    expect(enchantedNames).toEqual(baseNames);
  });
});
