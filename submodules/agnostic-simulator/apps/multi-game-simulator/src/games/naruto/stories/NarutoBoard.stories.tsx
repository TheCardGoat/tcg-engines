/**
 * Storybook stories for the naruto board (CSF3-shaped). Fixtures are
 * engine-built states (see ./fixtures.ts).
 *
 * Note: the workspace Storybook config currently only scans
 * packages/simulator-ui/src and @storybook/react-vite is not an app
 * dependency, so the Meta/StoryObj types are structural here; the shape is
 * standard CSF3 and drops into any react-vite Storybook as-is. These stories
 * are also exercised by the jsdom suite in __tests__/.
 */

import type { Action } from "@tcg-engines/naruto-engine";

import { NarutoBoard, type NarutoBoardProps } from "../board/NarutoBoard.tsx";
import { getNarutoFixture } from "./fixtures.ts";

function fixture(id: string) {
  const found = getNarutoFixture(id);
  if (!found) throw new Error(`Unknown fixture ${id}`);
  return found;
}

const logAction = (action: Action) => console.log("action", action);

interface BoardStory {
  readonly args: NarutoBoardProps;
}

const meta = {
  title: "Naruto/Board",
  component: NarutoBoard,
  parameters: { layout: "fullscreen" },
};

export default meta;

export const Opening: BoardStory = {
  args: {
    state: fixture("opening").state,
    viewer: "p2",
    interactive: false,
    onAction: () => undefined,
  },
};

export const MidGame: BoardStory = {
  args: {
    state: fixture("mid-game").state,
    viewer: "p1",
    interactive: true,
    onAction: logAction,
  },
};

export const CounterWindow: BoardStory = {
  args: {
    state: fixture("counter-window").state,
    viewer: "p2",
    interactive: true,
    onAction: logAction,
  },
};

export const BoardTargetChoice: BoardStory = {
  args: {
    state: fixture("board-target-choice").state,
    viewer: "p1",
    interactive: true,
    onAction: logAction,
  },
};

export const ExRequirementChoice: BoardStory = {
  args: {
    state: fixture("ex-requirement").state,
    viewer: "p1",
    interactive: true,
    onAction: logAction,
  },
};

export const ExChoiceModal: BoardStory = {
  args: {
    state: fixture("ex-search-modal").state,
    viewer: "p1",
    interactive: true,
    onAction: logAction,
  },
};

export const MobilePortrait: BoardStory = {
  args: {
    state: fixture("mobile-portrait").state,
    viewer: "p1",
    interactive: true,
    forceMobile: true,
    onAction: logAction,
  },
};
