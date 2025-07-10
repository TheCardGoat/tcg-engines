import { calculateDiff } from "@lorcanito/lorcana-engine/lib/deltaCompression";
import type { Match } from "@lorcanito/lorcana-engine/types/types";
import type { Diff } from "deep-diff";

// https://github.com/flitbit/diff#differences
const dictionary = {
  E: {
    color: "#2196F3",
    text: "CHANGED:",
  },
  N: {
    color: "#4CAF50",
    text: "ADDED:",
  },
  D: {
    color: "#F44336",
    text: "DELETED:",
  },
  A: {
    color: "#2196F3",
    text: "ARRAY:",
  },
};

export function style(kind: keyof typeof dictionary) {
  return `color: ${dictionary[kind].color}; font-weight: bold`;
}

// @ts-ignore
export function render(diff) {
  const { kind, path, lhs, rhs, index, item } = diff;

  switch (kind) {
    case "E":
      return [path.join("."), lhs, "→", rhs];
    case "N":
      return [path.join("."), rhs];
    case "D":
      return [path.join(".")];
    case "A":
      return [`${path.join(".")}[${index}]`, item];
    default:
      return [];
  }
}

export function diffAndLog(
  prevState: Match,
  newState: Match,
  logger: typeof console,
  isCollapsed?: boolean,
  onDiff?: (prev: Match, after: Match) => void,
): Diff<Match, Match>[] | undefined {
  const diff: Diff<Match, Match>[] | undefined = calculateDiff(
    prevState,
    newState,
  );

  if (diff && onDiff) {
    onDiff(prevState, newState);
  }

  logDiff(diff, logger, isCollapsed, onDiff);
  return diff;
}

export function logDiff(
  diff: Diff<Match, Match>[] | undefined,
  logger: typeof console,
  isCollapsed?: boolean,
  onDiff?: (prev: Match, after: Match) => void,
  prefix = "",
) {
  try {
    if (isCollapsed) {
      logger.groupCollapsed(prefix + " diff");
    } else {
      logger.group(prefix + " diff");
    }
  } catch (e) {
    logger.log(prefix + " diff");
  }

  if (diff) {
    diff.forEach((elem) => {
      const { kind } = elem;
      const output = render(elem);

      logger.log(`%c ${dictionary[kind].text}`, style(kind), ...output);
    });
  } else {
    logger.log("—— no diff ——");
  }

  try {
    logger.groupEnd();
  } catch (e) {
    logger.log("—— diff end —— ");
  }

  return diff;
}
