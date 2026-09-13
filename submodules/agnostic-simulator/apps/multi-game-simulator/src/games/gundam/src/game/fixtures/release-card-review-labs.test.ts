import { asPlayerId, pilotSatisfiesUnitLinkCondition } from "@tcg/gundam-engine";
import { describe, expect, it } from "vite-plus/test";

import { toGameCardData, mapZone } from "../../components/containers/mappers.ts";
import { createEngineAdapter } from "../adapter.ts";
import { DEV_PLAYER_ONE, DEV_PLAYER_TWO, type DevRuntime } from "../dev-runtime.ts";
import {
  RELEASE_REVIEW_CARDS,
  RELEASE_REVIEW_ENTRIES,
  loadReleaseCardReviewLab,
} from "./release-card-review-labs.ts";

function definitionsIn(
  dev: DevRuntime,
  playerId: typeof DEV_PLAYER_ONE | typeof DEV_PLAYER_TWO,
  zone: string,
) {
  const instanceIds =
    dev.runtime.getState().ctx.zones.private.zoneCards[`${zone}:${playerId}`] ?? [];
  return instanceIds.flatMap((instanceId) => {
    const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
    const definition = definitionId
      ? dev.staticResources.cardsMaps.definitions.get(definitionId)
      : undefined;
    return definition ? [{ instanceId, definition }] : [];
  });
}

describe("release card review labs", () => {
  it("excludes release cards without a structured effect", () => {
    expect(RELEASE_REVIEW_CARDS).toHaveLength(122);
    expect(RELEASE_REVIEW_ENTRIES.every(({ card }) => (card.effects?.length ?? 0) > 0)).toBe(true);

    const reviewedCardNumbers = RELEASE_REVIEW_CARDS.map((card) => card.cardNumber);
    expect(reviewedCardNumbers).not.toContain("ST10-003");
    expect(reviewedCardNumbers).not.toContain("ST10-004");
    expect(reviewedCardNumbers).not.toContain("ST10-009");
    expect(reviewedCardNumbers).not.toContain("GD05-040");
    expect(reviewedCardNumbers).not.toContain("GD05-045");
  });

  it("stages Sazabi and Geara Doga to exercise Axis's effect-destruction condition", () => {
    const dev = loadReleaseCardReviewLab("GD05-129", "main");

    try {
      const state = dev.runtime.getState();
      const hand = state.ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];
      const handCardNumbers = hand.map((instanceId) => {
        const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
        return definitionId
          ? dev.staticResources.cardsMaps.definitions.get(definitionId)?.cardNumber
          : undefined;
      });
      const bases = state.ctx.zones.private.zoneCards[`baseSection:${DEV_PLAYER_ONE}`] ?? [];
      const baseCardNumbers = bases.map((instanceId) => {
        const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
        return definitionId
          ? dev.staticResources.cardsMaps.definitions.get(definitionId)?.cardNumber
          : undefined;
      });
      const deck = state.ctx.zones.private.zoneCards[`deck:${DEV_PLAYER_ONE}`] ?? [];
      const deckCardNumbers = deck.map((instanceId) => {
        const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
        return definitionId
          ? dev.staticResources.cardsMaps.definitions.get(definitionId)?.cardNumber
          : undefined;
      });
      const trash = state.ctx.zones.private.zoneCards[`trash:${DEV_PLAYER_ONE}`] ?? [];

      expect(state.ctx.status.activePlayer).toBe(DEV_PLAYER_ONE);
      expect(handCardNumbers).toEqual(["GD05-052", "GD05-061"]);
      expect(baseCardNumbers).toEqual(["GD05-129"]);
      expect(deckCardNumbers).toHaveLength(10);
      expect(deckCardNumbers.slice(0, 5)).toEqual([
        "GD05-062",
        "ST01-001",
        "ST01-004",
        "ST01-003",
        "GD05-062",
      ]);
      expect(trash).toEqual([]);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages Presidential Office's opponent-started Destroyed review with valid and invalid Bases", () => {
    const dev = loadReleaseCardReviewLab("GD05-130", "destroyed");

    try {
      const state = dev.runtime.getState();
      const hand = state.ctx.zones.private.zoneCards[`hand:${DEV_PLAYER_ONE}`] ?? [];
      const handCardNumbers = hand.map((instanceId) => {
        const definitionId = dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
        return definitionId
          ? dev.staticResources.cardsMaps.definitions.get(definitionId)?.cardNumber
          : undefined;
      });

      expect(state.ctx.status.activePlayer).toBe(DEV_PLAYER_TWO);
      expect(handCardNumbers).toEqual(["GD05-130", "ST01-015"]);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages every real Kamille Bidan Pilot that links with ST10-001", () => {
    const dev = loadReleaseCardReviewLab("ST10-001", "battle");

    try {
      const cardsFor = (zone: "hand" | "battleArea") => {
        const instanceIds =
          dev.runtime.getState().ctx.zones.private.zoneCards[`${zone}:${DEV_PLAYER_ONE}`] ?? [];
        return instanceIds.flatMap((instanceId) => {
          const definitionId =
            dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
          const definition = definitionId
            ? dev.staticResources.cardsMaps.definitions.get(definitionId)
            : undefined;
          return definition ? [{ instanceId, definition }] : [];
        });
      };
      const zeta = cardsFor("battleArea").find(
        ({ definition }) => definition.cardNumber === "ST10-001",
      )?.definition;
      const linkPilots = cardsFor("hand")
        .map(({ definition }) => definition)
        .filter(
          (definition) =>
            definition.type === "pilot" && pilotSatisfiesUnitLinkCondition(definition, zeta),
        );

      expect(linkPilots.map((pilot) => pilot.cardNumber).sort()).toEqual(["GD02-097", "ST10-011"]);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages the complete Development setup for ST10-002", () => {
    const dev = loadReleaseCardReviewLab("ST10-002", "deploy");

    try {
      const developmentCards = definitionsIn(dev, DEV_PLAYER_ONE, "trash").filter(
        ({ definition }) =>
          definition.traits.some((trait) => trait.toLocaleLowerCase() === "g generation"),
      );
      const legalEnemyTargets = definitionsIn(dev, DEV_PLAYER_TWO, "battleArea").filter(
        ({ instanceId, definition }) =>
          definition.type === "unit" &&
          definition.hp <= 4 &&
          dev.runtime.getState().ctx.zones.private.cardMeta[instanceId]?.exhausted === false,
      );

      expect(developmentCards).toHaveLength(2);
      expect(legalEnemyTargets.length).toBeGreaterThan(0);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages a compatible Pilot and every Trash prerequisite for ST10-007", () => {
    const dev = loadReleaseCardReviewLab("ST10-007", "when-linked");

    try {
      const source = definitionsIn(dev, DEV_PLAYER_ONE, "battleArea").find(
        ({ definition }) => definition.cardNumber === "ST10-007",
      )?.definition;
      const compatiblePilots = definitionsIn(dev, DEV_PLAYER_ONE, "hand").filter(
        ({ definition }) =>
          definition.type === "pilot" && pilotSatisfiesUnitLinkCondition(definition, source),
      );
      const trash = definitionsIn(dev, DEV_PLAYER_ONE, "trash").map(({ definition }) => definition);

      expect(compatiblePilots.length).toBeGreaterThan(0);
      expect(
        trash.filter((definition) =>
          definition.traits.some((trait) => trait.toLocaleLowerCase() === "g generation"),
        ),
      ).toHaveLength(2);
      expect(
        trash.some((definition) => definition.type === "command" && definition.level <= 4),
      ).toBe(true);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages alternative deployment and turn-history prerequisites", () => {
    const forceImpulse = loadReleaseCardReviewLab("GD05-064", "deploy");
    const gaia = loadReleaseCardReviewLab("GD05-041", "board");

    try {
      expect(
        definitionsIn(forceImpulse, DEV_PLAYER_ONE, "hand").map(
          ({ definition }) => definition.cardNumber,
        ),
      ).toContain("GD02-110");
      expect(
        definitionsIn(forceImpulse, DEV_PLAYER_ONE, "trash").map(
          ({ definition }) => definition.cardNumber,
        ),
      ).toContain("GD05-064");
      expect(
        definitionsIn(forceImpulse, DEV_PLAYER_ONE, "trash").some(
          ({ definition }) =>
            definition.type === "pilot" &&
            definition.name.toLocaleLowerCase().includes("shinn asuka"),
        ),
      ).toBe(true);

      expect(
        definitionsIn(gaia, DEV_PLAYER_ONE, "hand").map(({ definition }) => definition.cardNumber),
      ).toContain("GD05-041");
      expect(gaia.runtime.getState().G.turnMetadata.opponentDiscardEffectOriginPlayerIds).toContain(
        DEV_PLAYER_ONE,
      );
    } finally {
      forceImpulse.bot?.dispose();
      gaia.bot?.dispose();
    }
  });

  it("stages a real opposing effect that can destroy a damaged Base", () => {
    const dev = loadReleaseCardReviewLab("GD05-130", "destroyed");

    try {
      const source = definitionsIn(dev, DEV_PLAYER_ONE, "baseSection").find(
        ({ definition }) => definition.cardNumber === "GD05-130",
      );
      if (!source || source.definition.type !== "base") {
        throw new Error("Expected the Presidential Office Base in Player 1's Base Section");
      }
      expect(dev.runtime.getState().G.damage[source.instanceId]).toBe(source.definition.hp - 1);
      expect(
        definitionsIn(dev, DEV_PLAYER_TWO, "hand").map(({ definition }) => definition.cardNumber),
      ).toContain("GD04-043");
      expect(dev.runtime.getState().ctx.status.activePlayer).toBe(DEV_PLAYER_TWO);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages Repair sources with damage to recover", () => {
    const dev = loadReleaseCardReviewLab("GD05-001", "repair");

    try {
      const source = definitionsIn(dev, DEV_PLAYER_ONE, "battleArea").find(
        ({ definition }) => definition.cardNumber === "GD05-001",
      );
      expect(source).toBeDefined();
      expect(dev.runtime.getState().G.damage[source!.instanceId]).toBe(1);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages damaged friendly G Generation Units for Luna Mana deploy recover", () => {
    const dev = loadReleaseCardReviewLab("ST10-016", "deploy");

    try {
      const generationUnits = definitionsIn(dev, DEV_PLAYER_ONE, "battleArea").filter(
        ({ definition }) =>
          definition.type === "unit" &&
          definition.traits.some((trait) => trait.toLocaleLowerCase() === "g generation"),
      );
      expect(generationUnits).not.toHaveLength(0);
      for (const unit of generationUnits) {
        expect(dev.runtime.getState().G.damage[unit.instanceId]).toBe(1);
      }
      expect(
        definitionsIn(dev, DEV_PLAYER_ONE, "hand").map(({ definition }) => definition.cardNumber),
      ).toContain("ST10-016");
      expect(definitionsIn(dev, DEV_PLAYER_ONE, "shieldArea").length).toBeGreaterThan(0);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages a Londo Bell Unit on top of the deck for Re-GZ destroyed tutor", () => {
    const dev = loadReleaseCardReviewLab("GD05-019", "destroyed");

    try {
      const deck = definitionsIn(dev, DEV_PLAYER_ONE, "deck");
      // Ordered deck: top cards are at the end of the zone array.
      const topThree = deck.slice(-3).reverse();
      const legalTutors = topThree.filter(
        ({ definition }) =>
          definition.type === "unit" &&
          definition.traits.some((trait) => trait.toLocaleLowerCase() === "londo bell"),
      );
      expect(legalTutors.length).toBeGreaterThanOrEqual(1);
      expect(
        definitionsIn(dev, DEV_PLAYER_ONE, "battleArea").some(
          ({ definition }) => definition.cardNumber === "GD05-019",
        ),
      ).toBe(true);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("leaves Resource Area headroom so Calibarn can place 3 EX Resources on deploy", () => {
    const dev = loadReleaseCardReviewLab("GD05-018", "deploy");

    try {
      const before = definitionsIn(dev, DEV_PLAYER_ONE, "resourceArea");
      // Rule 4-4-2 caps the area at 15. Calibarn places 3 EX tokens, so the
      // fixture must start at most at 12 or the deploy effect places nothing.
      expect(before).toHaveLength(12);

      const hand = definitionsIn(dev, DEV_PLAYER_ONE, "hand").find(
        ({ definition }) => definition.cardNumber === "GD05-018",
      );
      if (!hand) throw new Error("Expected Gundam Calibarn in hand");

      const adapter = createEngineAdapter({
        runtime: dev.runtime,
        staticResources: dev.staticResources,
        viewerId: dev.p1Id,
      });
      const deploy = adapter.submit(
        "deployUnit",
        adapter.seedForCard("deployUnit", hand.instanceId),
      );
      expect(deploy.ok, JSON.stringify(deploy)).toBe(true);

      const after = definitionsIn(dev, DEV_PLAYER_ONE, "resourceArea");
      const placed = after.filter(
        (entry) => !before.some((prior) => prior.instanceId === entry.instanceId),
      );
      expect(placed).toHaveLength(3);
      expect(placed.every(({ definition }) => definition.type === "resource")).toBe(true);
      // Paying cost 7 rests resources in place; net size is 12 + 3 EX = 15.
      expect(after).toHaveLength(15);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("projects Asshimar's During Link AP+2 and Repair into the simulator board view", () => {
    const dev = loadReleaseCardReviewLab("GD05-007", "board");

    try {
      const view = dev.runtime.getFilteredView({
        role: "player",
        playerId: asPlayerId(DEV_PLAYER_ONE),
      });
      const assimar = mapZone(view, "battleArea", DEV_PLAYER_ONE)
        .map((card) => toGameCardData(view, card))
        .find((card) => card.cardNumber === "GD05-007");
      if (!assimar) throw new Error("Expected Asshimar on Player 1's battle area");

      // Printed 1 AP + linked Pilot bonus + During Link AP+2. The prior UI
      // path only counted the Pilot bonus, so a +2 Pilot made the card look
      // like AP 3 instead of AP 5.
      expect(assimar.isLinkUnit).toBe(true);
      expect(assimar.ap).toBe(5);
      expect(assimar.keywords).toEqual(expect.arrayContaining([{ keyword: "Repair", value: 1 }]));
    } finally {
      dev.bot?.dispose();
    }
  });

  it("stages White Ark's real League Militaire rest-substitution sequence", () => {
    const whiteArk = loadReleaseCardReviewLab("GD05-124", "deploy");

    try {
      const battlefield = definitionsIn(whiteArk, DEV_PLAYER_ONE, "battleArea").map(
        ({ definition }) => definition.cardNumber,
      );
      expect(battlefield).toContain("GD04-006");
      expect(battlefield).toContain("GD04-015");
      expect(definitionsIn(whiteArk, DEV_PLAYER_TWO, "battleArea")).not.toHaveLength(0);
    } finally {
      whiteArk.bot?.dispose();
    }
  });

  it("stages an Orb Unit and opposing two-damage command for Archangel", () => {
    const archangel = loadReleaseCardReviewLab("GD05-123", "deploy");

    try {
      const orbUnits = definitionsIn(archangel, DEV_PLAYER_ONE, "battleArea").filter(
        ({ definition }) =>
          definition.type === "unit" &&
          definition.traits.some((trait) => trait.toLocaleLowerCase() === "orb"),
      );
      expect(orbUnits).not.toHaveLength(0);
      expect(
        definitionsIn(archangel, DEV_PLAYER_TWO, "hand").map(
          ({ definition }) => definition.cardNumber,
        ),
      ).toContain("GD05-110");
    } finally {
      archangel.bot?.dispose();
    }
  });

  it("keeps a separate discard card and a ten-card deck for command reviews", () => {
    const airframeSeizure = loadReleaseCardReviewLab("GD05-111", "main");

    try {
      const hand = definitionsIn(airframeSeizure, DEV_PLAYER_ONE, "hand");
      expect(hand.map(({ definition }) => definition.cardNumber)).toContain("GD05-111");
      expect(
        hand.filter(({ definition }) => definition.cardNumber !== "GD05-111"),
      ).not.toHaveLength(0);
      expect(definitionsIn(airframeSeizure, DEV_PLAYER_ONE, "deck")).toHaveLength(10);
    } finally {
      airframeSeizure.bot?.dispose();
    }
  });

  it("stages Burst reviews on Player 2's turn without unrelated Bases", () => {
    const burst = loadReleaseCardReviewLab("GD05-110", "burst");

    try {
      expect(definitionsIn(burst, DEV_PLAYER_ONE, "baseSection")).toHaveLength(0);
      expect(definitionsIn(burst, DEV_PLAYER_TWO, "baseSection")).toHaveLength(0);
      expect(
        definitionsIn(burst, DEV_PLAYER_ONE, "shieldArea").map(
          ({ definition }) => definition.cardNumber,
        ),
      ).toContain("GD05-110");
    } finally {
      burst.bot?.dispose();
    }
  });

  it("stages a genuinely paired Academy Unit for GD05-109's conditional draw", () => {
    const dev = loadReleaseCardReviewLab("GD05-109", "action");

    try {
      const state = dev.runtime.getState();
      const pairedAcademyUnits = definitionsIn(dev, DEV_PLAYER_ONE, "battleArea").filter(
        ({ instanceId, definition }) => {
          if (
            definition.type !== "unit" ||
            !definition.traits.some((trait) => trait.toLocaleLowerCase() === "academy")
          ) {
            return false;
          }
          const pilotId = state.G.pilotAssignments[instanceId];
          if (!pilotId) return false;
          const pilotDefinitionId =
            dev.staticResources.cardsMaps.instances.get(pilotId)?.definitionId;
          const pilot = pilotDefinitionId
            ? dev.staticResources.cardsMaps.definitions.get(pilotDefinitionId)
            : undefined;
          return pilot !== undefined && pilot.level <= 3;
        },
      );

      expect(pairedAcademyUnits.length).toBeGreaterThan(0);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("links Kira to a real Orb or Triple Ship Alliance Unit before the GD05-081 review", () => {
    const kira = loadReleaseCardReviewLab("GD05-081", "when-linked");

    try {
      const state = kira.runtime.getState();
      const pilot = definitionsIn(kira, DEV_PLAYER_ONE, "battleArea").find(
        ({ definition }) => definition.cardNumber === "GD05-081",
      );
      if (!pilot) throw new Error("Expected Kira in the Battle Area");
      const hostId = Object.entries(state.G.pilotAssignments).find(
        ([, pilotId]) => pilotId === pilot.instanceId,
      )?.[0];
      const definitionId = hostId
        ? kira.staticResources.cardsMaps.instances.get(hostId)?.definitionId
        : undefined;
      const host = definitionId
        ? kira.staticResources.cardsMaps.definitions.get(definitionId)
        : undefined;

      expect(host?.traits.some((trait) => ["orb", "triple ship alliance"].includes(trait))).toBe(
        true,
      );
    } finally {
      kira.bot?.dispose();
    }
  });

  it("stages Heavyarms' printed friendly condition and enemy target", () => {
    const heavyarms = loadReleaseCardReviewLab("GD05-079", "main");

    try {
      const friendlySupport = definitionsIn(heavyarms, DEV_PLAYER_ONE, "battleArea").filter(
        ({ definition }) =>
          definition.cardNumber !== "GD05-079" &&
          definition.type === "unit" &&
          definition.traits.some((trait) => ["g team", "preventer"].includes(trait)),
      );
      const enemyTarget = definitionsIn(heavyarms, DEV_PLAYER_TWO, "battleArea").filter(
        ({ definition }) => definition.type === "unit" && definition.level <= 4,
      );

      expect(friendlySupport).not.toHaveLength(0);
      expect(enemyTarget).not.toHaveLength(0);
    } finally {
      heavyarms.bot?.dispose();
    }
  });

  it("stages an unlinked MF host and every compatible Pilot for Gundam Fight's conditional bonus", () => {
    const dev = loadReleaseCardReviewLab("GD05-128", "main");

    try {
      const cardsFor = (zone: "hand" | "battleArea") => {
        const instanceIds =
          dev.runtime.getState().ctx.zones.private.zoneCards[`${zone}:${DEV_PLAYER_ONE}`] ?? [];
        return instanceIds.flatMap((instanceId) => {
          const definitionId =
            dev.staticResources.cardsMaps.instances.get(instanceId)?.definitionId;
          const definition = definitionId
            ? dev.staticResources.cardsMaps.definitions.get(definitionId)
            : undefined;
          return definition ? [{ instanceId, definition }] : [];
        });
      };
      const rising = cardsFor("battleArea").find(
        ({ definition }) => definition.cardNumber === "GD05-072",
      );
      const pilotOptions = cardsFor("hand")
        .map(({ definition }) => definition)
        .filter(
          (definition) =>
            definition.type === "pilot" &&
            pilotSatisfiesUnitLinkCondition(definition, rising?.definition),
        );

      expect(rising).toBeDefined();
      expect(pilotOptions.map((pilot) => pilot.cardNumber).sort()).toEqual([
        "GD05-089",
        "GD05-097",
      ]);
    } finally {
      dev.bot?.dispose();
    }
  });

  it("records the staged command instance in activated-this-turn history", () => {
    const dev = loadReleaseCardReviewLab("GD05-089", "attack");

    try {
      const state = dev.runtime.getState();
      const activatedIds = state.G.turnMetadata.activatedCommandThisTurn;
      const p1TrashIds = state.ctx.zones.private.zoneCards[`trash:${DEV_PLAYER_ONE}`] ?? [];

      expect(activatedIds).toHaveLength(1);
      expect(p1TrashIds).toContain(activatedIds[0]);
      const definitionId = dev.staticResources.cardsMaps.instances.get(
        activatedIds[0]!,
      )?.definitionId;
      const command = definitionId
        ? dev.staticResources.cardsMaps.definitions.get(definitionId)
        : undefined;
      expect(command?.type).toBe("command");
      expect(command?.traits).toContain("special move");
    } finally {
      dev.bot?.dispose();
    }
  });

  it("can construct every release-review timing with real prerequisite cards", () => {
    for (const { card, timings } of RELEASE_REVIEW_ENTRIES) {
      for (const timing of timings) {
        const dev = loadReleaseCardReviewLab(card.cardNumber, timing);
        dev.bot?.dispose();
      }
    }
  });
});
