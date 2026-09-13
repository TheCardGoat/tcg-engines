import { describe, expect, it } from "vite-plus/test";
import {
  FAB_MANUAL_HARNESS,
  FabTestEngine,
  candidateInstanceIdsForCanonicalId,
  expectFabCard,
  parseFabTargetArgs,
  resolveAttackTargetInstanceId,
  resolveFabCardTargetInstanceId,
} from "./index.ts";
import { takeCoverRed } from "../../../cards/src/cards/defense-reactions/take-cover.ts";
import { dash } from "../../../cards/src/cards/heroes/dash.ts";
import { cintariSaber } from "../../../cards/src/cards/weapons/cintari-saber.ts";
import { kassai } from "../../../cards/src/cards/heroes/kassai.ts";
import { cutTheDeckRed } from "../../../cards/src/cards/attack-reactions/cut-the-deck.ts";
import { brutalAssaultBlue } from "../../../cards/src/cards/shared/test-recipients.ts";
import { nimblismBlue } from "../../../cards/src/cards/actions/nimblism.ts";
import { snatchRed } from "../../../cards/src/cards/actions/snatch.ts";

describe("resolveAttackTargetInstanceId", () => {
  const proxies = {
    "attack-proxy:1": { sourceId: "weapon-1" },
  };

  it("prefers the live attack-proxy when both source and proxy are candidates", () => {
    expect(
      resolveAttackTargetInstanceId({
        sourceInstanceId: "weapon-1",
        candidates: [{ instanceId: "weapon-1" }, { instanceId: "attack-proxy:1" }],
        attackProxies: proxies,
        identity: "attack",
      }),
    ).toBe("attack-proxy:1");
  });

  it("identity source keeps the original object", () => {
    expect(
      resolveAttackTargetInstanceId({
        sourceInstanceId: "weapon-1",
        candidates: [{ instanceId: "weapon-1" }, { instanceId: "attack-proxy:1" }],
        attackProxies: proxies,
        identity: "source",
      }),
    ).toBe("weapon-1");
  });

  it("falls back to the source when no proxy is a candidate", () => {
    expect(
      resolveAttackTargetInstanceId({
        sourceInstanceId: "weapon-1",
        candidates: [{ instanceId: "weapon-1" }],
        attackProxies: proxies,
      }),
    ).toBe("weapon-1");
  });

  it("matches a proxy candidate by the source card's canonical id", () => {
    expect(
      candidateInstanceIdsForCanonicalId({
        canonicalId: "cintari",
        candidates: [{ instanceId: "attack-proxy:1" }],
        objects: { "weapon-1": { canonicalId: "cintari" } },
        attackProxies: { "attack-proxy:1": { sourceId: "weapon-1" } },
      }),
    ).toEqual(["attack-proxy:1"]);
  });

  it("uses the active-attack proxy identity when the proxy table is empty", () => {
    expect(
      resolveAttackTargetInstanceId({
        sourceInstanceId: "weapon-1",
        candidates: [{ instanceId: "attack-proxy:9" }],
        attackProxies: {},
        activeAttack: {
          kind: "proxy",
          proxyId: "attack-proxy:9" as never,
          sourceObjectId: "weapon-1" as never,
        },
      }),
    ).toBe("attack-proxy:9");
  });

  it("treats a source and its attack-proxy as one canonical card target", () => {
    expect(
      resolveFabCardTargetInstanceId({
        target: cintariSaber,
        candidates: [{ instanceId: "weapon-1" }, { instanceId: "attack-proxy:1" }],
        objects: { "weapon-1": { canonicalId: cintariSaber.canonicalId } },
        attackProxies: proxies,
      }),
    ).toBe("attack-proxy:1");
  });

  it("keeps distinct copies with the same canonical id ambiguous", () => {
    expect(() =>
      resolveFabCardTargetInstanceId({
        target: cintariSaber,
        candidates: [{ instanceId: "weapon-1" }, { instanceId: "weapon-2" }],
        objects: {
          "weapon-1": { canonicalId: cintariSaber.canonicalId },
          "weapon-2": { canonicalId: cintariSaber.canonicalId },
        },
        attackProxies: {},
      }),
    ).toThrow(/matched 2 legal sources/);
  });
});

describe("parseFabTargetArgs", () => {
  it("peels a trailing identity option off the named refs", () => {
    const parsed = parseFabTargetArgs(["weapon", { identity: "source" as const }]);
    expect(parsed.refs).toEqual(["weapon"]);
    expect(parsed.options.identity).toBe("source");
  });

  it("empty args is choose-none, not a parse error", () => {
    expect(parseFabTargetArgs([]).refs).toEqual([]);
    expect(parseFabTargetArgs([]).options).toEqual({});
  });
});

describe("target() intent (Cut the Deck)", () => {
  it("fails loudly when no chooser exists instead of masking a stale target assertion", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [cutTheDeckRed, brutalAssaultBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deck: 6,
      },
      { hero: dash, hand: [], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(cutTheDeckRed);
    game.passBoth();
    expect(() => Kassai.targetRequired(brutalAssaultBlue)).toThrow(
      /pending entity-target decision/,
    );

    // Printed put-on-bottom is inside the AAC-defend conditional; undefended
    // leaves no chooser and the named target intent must not silently pass.
    expect(Kassai.cardsIn("hand", brutalAssaultBlue).length).toBe(1);
    expectFabCard(Kassai, cutTheDeckRed).toBeIn("graveyard");
  });

  it("answers the chooser when two remaining cards make the put-on-bottom undetermined", () => {
    const game = FabTestEngine.start(
      {
        hero: kassai,
        weapon1: [cintariSaber],
        hand: [cutTheDeckRed, brutalAssaultBlue, nimblismBlue],
        resourcePoints: 2,
        actionPoints: 1,
        deckTop: [snatchRed],
        deck: 6,
      },
      { hero: dash, hand: [snatchRed], deck: 6 },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);

    Kassai.must.activate(cintariSaber);
    game.advanceCombatTo("defend");
    Dash.must.defend(snatchRed);
    game.advanceCombatTo("reaction");
    Kassai.must.playReaction(cutTheDeckRed);
    game.passBoth();
    Kassai.target(brutalAssaultBlue);

    expect(Kassai.cardsIn("deck", brutalAssaultBlue).length).toBe(1);
    expectFabCard(Kassai, nimblismBlue).toBeIn("hand");
  });

  it("fails loudly on a pending non-target decision without stealing it", () => {
    const game = FabTestEngine.start(
      { hero: kassai, hand: [snatchRed], actionPoints: 1, deck: 6 },
      {
        hero: dash,
        hand: [takeCoverRed, nimblismBlue],
        arsenal: [],
        life: 20,
        deck: 6,
      },
      FAB_MANUAL_HARNESS,
    );
    const Kassai = game.as(kassai);
    const Dash = game.as(dash);
    Kassai.must.playAttack(snatchRed);
    game.toReaction("defender");
    game.playInstance(Dash.id, Dash.findCardInZone("hand", takeCoverRed), {}, "explicit");
    game.passBoth();
    expect(game.getState().decision?.kind).toBe("boolean");
    expect(() => Dash.targetRequired(nimblismBlue)).toThrow(/pending entity-target decision/);
    expect(game.getState().decision?.kind).toBe("boolean");
  });
});
