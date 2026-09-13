import { describe, expect, it } from "vitest";
import { FAB_MANUAL_HARNESS, FabTestEngine, expectFabCard } from "../../../../testing/index.ts";
import { dash } from "../../../../../../cards/src/cards/heroes/dash.ts";
import { malice } from "../../../../../../cards/src/cards/heroes/malice.ts";
import { snatchRed } from "../../../../../../cards/src/cards/actions/snatch.ts";
import { corruptedCorpse } from "../../../../../../cards/src/cards/actions/corrupted-corpse.ts";
import { restlessMagisterRed } from "../../../../../../cards/src/cards/actions/restless-magister.ts";

describe("keyword: incarnate", () => {
  it("UST notes: an Incarnate ally that would die ceases to exist and does not fire die triggers", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arena: [corruptedCorpse],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Malice = game.as(malice);
    const corpse = Malice.findCardInZone("arena", corruptedCorpse);

    Dash.playAttack(snatchRed, { target: corpse });
    Malice.defendWith([]);
    game.closeCombat();
    game.untilIdle();

    expect(Malice.zone("arena")).not.toContain(corruptedCorpse.canonicalId);
    expect(Malice.zone("graveyard")).not.toContain(corruptedCorpse.canonicalId);
    expect(Malice.zone("banished")).not.toContain(corruptedCorpse.canonicalId);
    // Malice's "whenever a zombie you control dies" does not fire.
    expect(Malice.zone("banished").filter((id) => id === corruptedCorpse.canonicalId)).toHaveLength(
      0,
    );
  });

  it("UST notes boundary: a non-Incarnate zombie dies and Malice's die trigger fires", () => {
    const game = FabTestEngine.start(
      { hero: dash, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: malice,
        arena: [restlessMagisterRed],
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Dash = game.as(dash);
    const Malice = game.as(malice);
    const magister = Malice.findCardInZone("arena", restlessMagisterRed);

    Dash.playAttack(snatchRed, { target: magister });
    Malice.defendWith([]);
    Dash.pass();
    Malice.pass();
    Dash.pass();
    Malice.pass();
    Dash.choose("player-2");
    game.untilIdle();

    expectFabCard(Malice, restlessMagisterRed).toBeIn("banished").toBeFaceDown();
    expect(Malice.zone("banished")).toContain(corruptedCorpse.canonicalId);
  });
});
