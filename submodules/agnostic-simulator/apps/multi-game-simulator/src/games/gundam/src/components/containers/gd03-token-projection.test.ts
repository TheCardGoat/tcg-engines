import { describe, expect, it } from "vite-plus/test";

import {
  gd03BernardWiseman089,
  gd03CgsMobileWorkerCommanderType060,
  gd03HyGogg024,
  gd03MAVTactics106,
  gd03MikhailKaminsky090,
  gd03OrgaSOrder117,
  gd03ZakuFz020,
  st05WithIronAndBlood013,
} from "@tcg/gundam-cards";
import {
  GundamTestEngine,
  PLAYER_ONE,
  activeResources,
  createMockUnit,
  expectSuccess,
} from "@tcg/gundam-engine";

import { toSimulatorEntity } from "../ui/card/to-simulator-entity.ts";
import { applyLiveStateUpdate, createLiveMatchViewerEngine } from "../../engine/live/liveState.ts";
import { mapZone, toGameCardData } from "./mappers.ts";

interface TokenScenario {
  engine: GundamTestEngine;
  deploy: () => void;
}

interface TokenCase {
  cardNumber: string;
  name: string;
  traits: string[];
  imageUrl: string;
  effect?: string;
  create: () => TokenScenario;
}

const tokenCases: TokenCase[] = [
  {
    cardNumber: "T-013",
    name: "Hy-Gogg",
    traits: ["cyclops team"],
    imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-013.webp",
    create: () => {
      const cyclopsAlly = createMockUnit({ traits: ["cyclops team"] });
      const engine = GundamTestEngine.create({
        hand: [gd03MikhailKaminsky090],
        play: [gd03HyGogg024, cyclopsAlly],
        resourceArea: activeResources(4),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const hyGoggId = p1.getCardsInZone("battleArea")[0]!;

      return {
        engine,
        deploy: () => expectSuccess(p1.assignPilot(gd03MikhailKaminsky090, hyGoggId)),
      };
    },
  },
  {
    cardNumber: "T-014",
    name: "Ad Balloon",
    traits: ["civilian"],
    imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-014.webp",
    effect: "This Unit can't be set as active or paired with a Pilot.",
    create: () => {
      const cyclopsTrash = Array.from({ length: 4 }, () =>
        createMockUnit({ traits: ["cyclops team"] }),
      );
      const engine = GundamTestEngine.create({
        hand: [gd03BernardWiseman089],
        play: [gd03ZakuFz020],
        trash: cyclopsTrash,
        resourceArea: activeResources(2),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const zakuId = p1.getCardsInZone("battleArea")[0]!;

      return {
        engine,
        deploy: () => expectSuccess(p1.assignPilot(gd03BernardWiseman089, zakuId)),
      };
    },
  },
  {
    cardNumber: "T-015",
    name: "CGS Mobile Worker",
    traits: ["tekkadan"],
    imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-015.webp",
    create: () => {
      const engine = GundamTestEngine.create({
        hand: [st05WithIronAndBlood013],
        play: [gd03CgsMobileWorkerCommanderType060],
        resourceArea: activeResources(3),
      });
      const p1 = engine.asPlayer(PLAYER_ONE);
      const commanderId = p1.getCardsInZone("battleArea")[0]!;

      return {
        engine,
        deploy: () =>
          expectSuccess(p1.playCommand(st05WithIronAndBlood013, { targets: [commanderId] })),
      };
    },
  },
  {
    cardNumber: "T-016",
    name: "Graze Custom",
    traits: ["tekkadan"],
    imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-016.webp",
    create: () => {
      const engine = GundamTestEngine.create(
        { hand: [gd03OrgaSOrder117], resourceArea: activeResources(3) },
        { play: [createMockUnit()] },
      );

      return {
        engine,
        deploy: () => expectSuccess(engine.asPlayer(PLAYER_ONE).playCommand(gd03OrgaSOrder117)),
      };
    },
  },
  {
    cardNumber: "T-017",
    name: "Gundam Barbatos 4th Form",
    traits: ["tekkadan"],
    imageUrl: "https://r2.tcg.online/public/gundam/cards/t/T-017.webp",
    create: () => {
      const enemyUnits = Array.from({ length: 5 }, () => createMockUnit());
      const engine = GundamTestEngine.create(
        { hand: [gd03OrgaSOrder117], resourceArea: activeResources(3) },
        { play: enemyUnits },
      );

      return {
        engine,
        deploy: () => expectSuccess(engine.asPlayer(PLAYER_ONE).playCommand(gd03OrgaSOrder117)),
      };
    },
  },
];

describe("GD03 token cards in the simulator projection", () => {
  for (const tokenCase of tokenCases) {
    it(`hydrates ${tokenCase.cardNumber} into a live viewer with its printed identity`, () => {
      const { engine: serverEngine, deploy } = tokenCase.create();
      const live = createLiveMatchViewerEngine(serializedState(serverEngine));

      deploy();
      const tokenState = serializedState(serverEngine);
      applyLiveStateUpdate(live.runtime, live.staticResources, tokenState);
      const joinedAfterDeployment = createLiveMatchViewerEngine(tokenState);

      for (const runtime of [live.runtime, joinedAfterDeployment.runtime]) {
        const view = runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE });
        const visibleCards = mapZone(view, "battleArea", PLAYER_ONE).map((card) =>
          toGameCardData(view, card),
        );
        const renderedToken = visibleCards.find((card) => card.cardNumber === tokenCase.cardNumber);
        expect(renderedToken).toBeDefined();

        const entity = toSimulatorEntity(renderedToken!, {
          zoneId: `battleArea:${PLAYER_ONE}`,
        });
        expect(entity.title).toBe(tokenCase.name);
        expect(entity.traits).toEqual(tokenCase.traits);
        expect(entity.imageUrl).toBe(tokenCase.imageUrl);
        expect(renderedToken?.set).toBe("gd03");
        if (tokenCase.effect !== undefined) {
          expect(renderedToken?.effect).toBe(tokenCase.effect);
        }
      }
    });
  }

  it("hydrates an unprinted token as a visible simulator card with its public stats", () => {
    const serverEngine = GundamTestEngine.create({
      hand: [gd03MAVTactics106],
      resourceArea: activeResources(6),
    });
    const live = createLiveMatchViewerEngine(serializedState(serverEngine));

    expectSuccess(serverEngine.asPlayer(PLAYER_ONE).playCommand(gd03MAVTactics106));
    applyLiveStateUpdate(live.runtime, live.staticResources, serializedState(serverEngine));

    const view = live.runtime.getFilteredView({ role: "player", playerId: PLAYER_ONE });
    const visibleCards = mapZone(view, "battleArea", PLAYER_ONE).map((card) =>
      toGameCardData(view, card),
    );
    const omegaPsycommu = visibleCards.find((card) => card.name === "GQuuuuuuX (Omega Psycommu)");
    expect(omegaPsycommu).toMatchObject({ ap: 3, hp: 2 });

    const entity = toSimulatorEntity(omegaPsycommu!, {
      zoneId: `battleArea:${PLAYER_ONE}`,
    });
    expect(entity).toMatchObject({
      title: "GQuuuuuuX (Omega Psycommu)",
      face: "public",
      stats: expect.arrayContaining([
        { label: "AP", value: "3" },
        { label: "HP", value: "2" },
      ]),
    });
    expect(entity.imageUrl).toBeUndefined();
  });
});

function serializedState(engine: GundamTestEngine): Record<string, unknown> {
  return structuredClone(engine.getState()) as unknown as Record<string, unknown>;
}
