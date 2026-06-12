import { describe, expect, it } from "vite-plus/test";
import { alphaSwordwiseHuscle, spoilerGorillaArms } from "@tcg/cyberpunk-cards";
import { CyberpunkTestEngine, P1 } from "../../../testing/index.ts";

describe("Gorilla Arms", () => {
  it("attaches to a unit and contributes four power", () => {
    const engine = CyberpunkTestEngine.createWithFixture({
      hand: [spoilerGorillaArms],
      field: [{ card: alphaSwordwiseHuscle, spent: false }],
      eddies: 4,
    });

    expect(engine.attachGear(spoilerGorillaArms, alphaSwordwiseHuscle, { as: P1 })).toMatchObject({
      success: true,
    });
    const host = engine.getCard(alphaSwordwiseHuscle, "field", P1);
    expect(host.meta.attachedGearIds).toHaveLength(1);
  });

  it("is limited to the first same-sided extra steal each turn", () => {
    const ability = spoilerGorillaArms.abilities[0]!;
    expect(ability.trigger).toMatchObject({ trigger: "event", event: { event: "gigStolen" } });
    expect(ability.limits).toContain("firstTimeEachTurn");
    expect(ability.effects[0]).toMatchObject({ effect: "stealGig", optional: true });
  });
});
