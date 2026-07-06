import {
  createTestMatchState,
  SOUTH,
  type MatchSeat,
  type MatchState,
  type PlayerFixture,
} from "@tcg/op-engine";
import { createMatch, createSt01PlayerConfig } from "@tcg/op-engine/practice-st01";

export type OnePieceVisualFixtureGroup = "core" | "privacy" | "resources";
export type OnePieceVisualFixtureId =
  | "fresh-game-setup"
  | "main-phase-reference"
  | "privacy-hidden-zones"
  | "resource-board-state";

export interface OnePieceVisualFixture {
  id: OnePieceVisualFixtureId;
  group: OnePieceVisualFixtureGroup;
  label: string;
  description: string;
  buildState: () => MatchState;
}

const CARD = {
  kaidoLeader: "OP01-061",
  luffyLeader: "OP05-060",
  queenLeader: "OP04-040",
  luffyCharacter: "OP04-014",
  zoro: "OP04-015",
  nami: "OP04-011",
  sanji: "OP04-007",
  queen: "OP04-046",
  kaidoCharacter: "OP04-044",
  thousandSunny: "EB02-009",
  gumGumGatling: "OP13-021",
  gumGumRedRoc: "OP04-056",
  dragonTwister: "OP04-057",
  badMannersKickCourse: "OP04-016",
  colorsTrap: "OP04-074",
} as const;

export const ONE_PIECE_VISUAL_FIXTURE_GROUPS: readonly {
  id: OnePieceVisualFixtureGroup;
  label: string;
}[] = [
  { id: "core", label: "Core board states" },
  { id: "privacy", label: "Privacy states" },
  { id: "resources", label: "Resource states" },
];

export const ONE_PIECE_VISUAL_FIXTURES: readonly OnePieceVisualFixture[] = [
  {
    id: "fresh-game-setup",
    group: "core",
    label: "Fresh game setup",
    description:
      "A newly prepared ST-01 mirror game before the first turn begins: leaders, opening hands, Life, empty play areas, and full DON!! decks.",
    buildState: () =>
      createMatch({
        firstPlayer: SOUTH,
        shuffleDecks: true,
        openingHandSize: 5,
        skipFirstTurnDraw: true,
        maxCharacterSlots: 5,
        players: {
          south: createSt01PlayerConfig("You"),
          north: createSt01PlayerConfig("Opponent"),
        },
      }),
  },
  {
    id: "main-phase-reference",
    group: "core",
    label: "Main phase reference",
    description:
      "Luffy versus Kaido with hands, leaders, character lanes, stage, life, trash, and DON!! counts visible.",
    buildState: () => {
      const state = createVisualState({
        south: {
          leaderCardId: CARD.luffyLeader,
          playerName: "You",
          hand: [CARD.zoro, CARD.nami, CARD.gumGumGatling, CARD.luffyCharacter, CARD.sanji],
          deck: 39,
          life: 5,
          character: [CARD.zoro, { cardId: CARD.nami, rested: true }],
          stage: CARD.thousandSunny,
          trash: [CARD.gumGumGatling, CARD.gumGumRedRoc, CARD.badMannersKickCourse],
          activeDon: 1,
          restedDon: 1,
          donDeckCount: 7,
        },
        north: {
          leaderCardId: CARD.kaidoLeader,
          playerName: "Opponent",
          hand: [
            CARD.kaidoCharacter,
            CARD.queen,
            CARD.dragonTwister,
            CARD.colorsTrap,
            CARD.badMannersKickCourse,
          ],
          deck: 40,
          life: 5,
          character: [{ cardId: CARD.queen, rested: true, attachedDon: 1 }],
          stage: null,
          trash: [CARD.dragonTwister, CARD.colorsTrap],
          activeDon: 1,
          restedDon: 0,
          donDeckCount: 8,
        },
      });
      attachDonToLeader(state, SOUTH, 1);
      return state;
    },
  },
  {
    id: "privacy-hidden-zones",
    group: "privacy",
    label: "Privacy hidden zones",
    description:
      "Opponent hand, deck, and life are populated with recognizable cards but projected as hidden to the south viewer.",
    buildState: () =>
      createVisualState({
        south: {
          leaderCardId: CARD.luffyLeader,
          playerName: "You",
          hand: [CARD.nami, CARD.zoro],
          deck: 24,
          life: 5,
          character: [CARD.sanji],
          stage: null,
          trash: [CARD.gumGumGatling],
          activeDon: 2,
          restedDon: 0,
          donDeckCount: 8,
        },
        north: {
          leaderCardId: CARD.queenLeader,
          playerName: "Opponent",
          hand: [
            CARD.kaidoCharacter,
            CARD.dragonTwister,
            CARD.colorsTrap,
            CARD.badMannersKickCourse,
          ],
          deck: [
            CARD.kaidoCharacter,
            CARD.dragonTwister,
            CARD.colorsTrap,
            CARD.badMannersKickCourse,
          ],
          life: [
            CARD.kaidoCharacter,
            CARD.dragonTwister,
            CARD.colorsTrap,
            CARD.badMannersKickCourse,
          ],
          character: [],
          stage: null,
          trash: [CARD.queen],
          activeDon: 0,
          restedDon: 2,
          donDeckCount: 8,
        },
      }),
  },
  {
    id: "resource-board-state",
    group: "resources",
    label: "Resource board state",
    description:
      "DON!! counts, empty stage slots, stack counts, rested cards, and trash piles are emphasized.",
    buildState: () =>
      createVisualState({
        south: {
          leaderCardId: CARD.luffyLeader,
          playerName: "You",
          hand: [CARD.zoro, CARD.nami, CARD.sanji],
          deck: 12,
          life: 3,
          character: [
            { cardId: CARD.zoro, attachedDon: 2 },
            { cardId: CARD.sanji, rested: true },
          ],
          stage: null,
          trash: [
            CARD.gumGumGatling,
            CARD.gumGumRedRoc,
            CARD.badMannersKickCourse,
            CARD.colorsTrap,
          ],
          activeDon: 3,
          restedDon: 4,
          donDeckCount: 3,
        },
        north: {
          leaderCardId: CARD.kaidoLeader,
          playerName: "Opponent",
          hand: 2,
          deck: 18,
          life: 2,
          character: [{ cardId: CARD.queen, rested: true }],
          stage: null,
          trash: [CARD.dragonTwister],
          activeDon: 0,
          restedDon: 5,
          donDeckCount: 5,
        },
      }),
  },
];

export const DEFAULT_ONE_PIECE_VISUAL_FIXTURE_ID: OnePieceVisualFixtureId = "fresh-game-setup";

export function getOnePieceVisualFixture(id: string): OnePieceVisualFixture | undefined {
  return ONE_PIECE_VISUAL_FIXTURES.find((fixture) => fixture.id === id);
}

export function getDefaultOnePieceVisualFixture(): OnePieceVisualFixture {
  return getOnePieceVisualFixture(DEFAULT_ONE_PIECE_VISUAL_FIXTURE_ID)!;
}

function createVisualState({
  south,
  north,
}: {
  south: PlayerFixture;
  north: PlayerFixture;
}): MatchState {
  const state = createTestMatchState(south, north, {
    activeSeat: SOUTH,
    firstPlayer: SOUTH,
    seed: "one-piece-visual-fixture",
  });
  state.turnNumber = 4;
  state.phase = "main";
  state.status = "active";
  state.activeSeat = SOUTH;
  state.setup.started = true;
  return state;
}

function attachDonToLeader(state: MatchState, seat: MatchSeat, amount: number) {
  const leaderId = state.players[seat].leaderInstanceId;
  const leader = state.cards[leaderId];
  if (leader) {
    leader.attachedDon = amount;
  }
}
