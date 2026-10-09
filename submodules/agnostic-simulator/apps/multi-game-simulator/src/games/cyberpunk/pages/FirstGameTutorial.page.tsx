import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from "react";
import type { ScenarioId, LocalCommandCommit } from "../engine";
import { BoardSharedPage } from "./BoardShared.page";
import {
  firstGameTutorialMessages,
  handsOnTutorialMessages,
  resolveTutorialLocale,
  v2HandsOnMessages,
  type HandsOnStepId,
  type TutorialStepId,
  type V2TutorialStepId,
} from "../components/FirstGameTutorial/firstGameTutorialMessages";
import {
  readTutorialLocalePreference,
  saveFirstGameTutorialResult,
} from "../components/FirstGameTutorial/storage";
import { SuppressPaymentDiscovery } from "../components/PaymentSelection/PaymentSelectionPlayerAction";
import { useUserConfig } from "../engine/UserConfigContext";
import classes from "./FirstGameTutorial.module.css";

type Lesson = { id: V2TutorialStepId; scenario: ScenarioId; move?: string };

const v1Lessons: readonly Lesson[] = [
  { id: "cards", scenario: "openingMain" },
  { id: "sell", scenario: "openingMain", move: "sellCard" },
  { id: "play", scenario: "openingMain", move: "playCard" },
  { id: "attack", scenario: "attackStep", move: "attackUnit" },
  { id: "block", scenario: "reactStep", move: "useBlocker" },
  { id: "settings", scenario: "openingMain" },
  { id: "report", scenario: "openingMain" },
  { id: "payment", scenario: "openingMain" },
  { id: "priority", scenario: "reactStep", move: "setCombatPriority" },
  { id: "bug", scenario: "openingMain" },
  { id: "correction", scenario: "openingMain" },
  { id: "undo", scenario: "openingMain" },
];

/** The V2 board tour: same game, but the motions and controls differ. */
const v2Lessons: readonly Lesson[] = [
  { id: "cards", scenario: "openingMain" },
  { id: "sell", scenario: "openingMain", move: "sellCard" },
  { id: "play", scenario: "openingMain", move: "playCard" },
  { id: "eddies", scenario: "openingMain" },
  { id: "attack", scenario: "attackStep", move: "attackUnit" },
  { id: "block", scenario: "reactStep", move: "useBlocker" },
  { id: "actions", scenario: "openingMain" },
  { id: "priority", scenario: "reactStep", move: "setCombatPriority" },
  { id: "payment", scenario: "openingMain" },
  { id: "settings", scenario: "openingMain" },
  { id: "report", scenario: "openingMain" },
  { id: "bug", scenario: "openingMain" },
  { id: "correction", scenario: "openingMain" },
  { id: "undo", scenario: "openingMain" },
];

function readBoardVersion(): "v1" | "v2" {
  if (typeof window === "undefined") return "v1";
  return new URLSearchParams(window.location.search).get("ui") === "v2" ? "v2" : "v1";
}

type SpotlightRect = { top: number; left: number; width: number; height: number };

function v1TargetSelector(step: V2TutorialStepId, mobile: boolean): string {
  switch (step) {
    case "cards":
      return '[data-zone="p-hand"]';
    case "sell":
      return '[data-zone="p-hand"][data-zone-index="2"]';
    case "play":
      return '[data-zone="p-hand"][data-zone-index="1"]';
    case "attack":
      return '[data-zone="p-field"][data-zone-index="1"]';
    case "block":
      return '[data-zone="p-field"][data-zone-index="2"]';
    case "settings":
      return mobile
        ? '[aria-label="Open more match options"]'
        : '[aria-label="Open your player actions"]';
    case "report":
      return mobile ? '[aria-label="Opponent status"]' : '[aria-label="Opponent match status"]';
    case "payment":
      return '[aria-label="Choose payment for every cost"], [aria-label="Manual payment enabled"]';
    case "priority":
      return '[aria-label="Hold combat priority"]';
    case "bug":
    case "correction":
      return mobile
        ? '[aria-label="Open more match options"]'
        : '[aria-label="Open your player actions"]';
    case "undo":
      return mobile
        ? '[aria-label="Undo last move"]'
        : '[aria-label="Undo last move"], [aria-label="No undoable move available"]';
    case "eddies":
    case "actions":
      // V2-only lessons; the V1 board never shows them.
      return "";
    default: {
      const unreachable: never = step;
      return unreachable;
    }
  }
}

function v2TargetSelector(step: V2TutorialStepId): string {
  switch (step) {
    case "cards":
      return '[data-testid="hand-card"][data-rival="false"]';
    case "sell":
      // The sell surface appears while dragging; the Gig lane marks its top edge.
      return '[data-sim-zone-id="p-gigArea"]';
    case "play":
      return '[data-zone-id="p-field"]';
    case "eddies":
      return '[aria-label^="Your resources"]';
    case "attack":
      return '[data-zone-id="opp-field"]';
    case "block":
      return '[data-zone-lane="field"][data-rival="false"]';
    case "actions":
      return '[data-testid="phase-hud"]';
    case "priority":
      return '[aria-label="Hold combat priority"], [aria-label="Hold to react"]';
    case "payment":
      return '[aria-label="Manual payment"]';
    case "settings":
    case "report":
    case "bug":
    case "correction":
      // The sidebar lives in the Match drawer on V2.
      return '[aria-label="Match"]';
    case "undo":
      return '[aria-label="Undo last move"], [aria-label="No undoable move available"]';
    default: {
      const unreachable: never = step;
      return unreachable;
    }
  }
}

function TutorialSpotlight({
  target,
  visible,
}: {
  target: (mobile: boolean) => string;
  visible: boolean;
}) {
  const [rect, setRect] = useState<SpotlightRect | null>(null);

  useLayoutEffect(() => {
    if (!visible) {
      setRect(null);
      return;
    }

    let frame = 0;
    const update = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        const openSurface = Array.from(
          document.querySelectorAll<HTMLElement>('[role="menu"], [role="dialog"]'),
        ).some((element) => {
          const box = element.getBoundingClientRect();
          return box.width > 0 && box.height > 0;
        });
        if (openSurface) {
          setRect(null);
          return;
        }
        const mobile = window.matchMedia("(max-width: 767px)").matches;
        const selector = target(mobile);
        const elements = selector
          ? Array.from(document.querySelectorAll<HTMLElement>(selector))
          : [];
        const boxes = elements
          .map((element) => element.getBoundingClientRect())
          .filter((box) => box.width > 0 && box.height > 0);
        if (!boxes.length) {
          setRect(null);
          return;
        }
        const padding = 6;
        const left = Math.max(3, Math.min(...boxes.map((box) => box.left)) - padding);
        const top = Math.max(3, Math.min(...boxes.map((box) => box.top)) - padding);
        const right = Math.min(
          window.innerWidth - 3,
          Math.max(...boxes.map((box) => box.right)) + padding,
        );
        const bottom = Math.min(
          window.innerHeight - (mobile ? 52 : 3),
          Math.max(...boxes.map((box) => box.bottom)) + padding,
        );
        const next = { top, left, width: right - left, height: bottom - top };
        setRect((previous) =>
          previous &&
          previous.top === next.top &&
          previous.left === next.left &&
          previous.width === next.width &&
          previous.height === next.height
            ? previous
            : next,
        );
      });
    };

    update();
    const observer = new MutationObserver(update);
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ["aria-label", "role"],
    });
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [target, visible]);

  return rect ? (
    <div
      aria-hidden="true"
      className={classes.spotlight}
      data-testid="first-game-spotlight"
      style={rect}
    />
  ) : null;
}

export function FirstGameTutorialPage() {
  const locale = useMemo(
    () => resolveTutorialLocale(readTutorialLocalePreference(), navigator.languages),
    [],
  );
  const copy = firstGameTutorialMessages[locale];
  const handsOn = handsOnTutorialMessages[locale];
  const [isV2] = useState(() => readBoardVersion() === "v2");
  const lessons = isV2 ? v2Lessons : v1Lessons;
  const [index, setIndex] = useState(() => {
    if (typeof window === "undefined") return 0;
    const requested = new URLSearchParams(window.location.search).get("step");
    const requestedIndex = lessons.findIndex((entry) => entry.id === requested);
    return requestedIndex < 0 ? 0 : requestedIndex;
  });
  const [actionDone, setActionDone] = useState(false);
  const [paymentStage, setPaymentStage] = useState<"awaitEnable" | "awaitDisable">("awaitEnable");
  const [paymentDone, setPaymentDone] = useState(false);
  const [finished, setFinished] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const lesson = lessons[index];
  const { choosePaymentSources } = useUserConfig();
  const previousPaymentSelection = useRef(choosePaymentSources);
  const requiredMove = lesson.move ?? null;
  const stepDone = lesson.id === "payment" ? paymentDone : actionDone;
  const actionRequired = Boolean(requiredMove || lesson.id === "payment");
  const stepCopy = isV2
    ? v2HandsOnMessages[locale].steps[lesson.id]
    : lesson.id in handsOn.steps
      ? handsOn.steps[lesson.id as HandsOnStepId]
      : copy.steps[lesson.id as TutorialStepId];
  const spotlightTarget = useCallback(
    (mobile: boolean) => (isV2 ? v2TargetSelector(lesson.id) : v1TargetSelector(lesson.id, mobile)),
    [isV2, lesson.id],
  );

  const onCommit = useCallback(
    (commit: LocalCommandCommit) => {
      if (commit.source !== "human" || commit.side !== "player") return;
      if (
        commit.result.processedCommand.move === requiredMove ||
        (requiredMove === "attackUnit" && commit.result.processedCommand.move === "attackRival") ||
        (requiredMove === "useBlocker" && commit.result.processedCommand.move === "resolveAttack")
      ) {
        setActionDone(true);
      }
    },
    [requiredMove],
  );

  useEffect(() => {
    const changed = previousPaymentSelection.current !== choosePaymentSources;
    previousPaymentSelection.current = choosePaymentSources;
    if (lesson.id !== "payment" || !changed) return;
    if (choosePaymentSources) setPaymentStage("awaitDisable");
    else if (paymentStage === "awaitDisable") setPaymentDone(true);
  }, [lesson.id, choosePaymentSources, paymentStage]);

  const next = () => {
    if (index === lessons.length - 1) {
      setFinished(true);
      saveFirstGameTutorialResult("completed", isV2 ? "v2" : "v1");
      return;
    }
    setIndex(index + 1);
    setActionDone(false);
    setPaymentStage("awaitEnable");
    setPaymentDone(false);
  };

  const dismiss = () => {
    saveFirstGameTutorialResult("dismissed", isV2 ? "v2" : "v1");
    setSkipped(true);
    setFinished(true);
  };

  return (
    <main className={classes.page} data-testid="first-game-tutorial" data-step={lesson.id}>
      <SuppressPaymentDiscovery>
        <BoardSharedPage
          key={`${index}-${lesson.scenario}`}
          scenarioId={lesson.scenario}
          initialAi={{ player: null, opponent: null }}
          initialAiMode="step"
          onLocalCommandCommitted={onCommit}
          lockLocalHistoryControls
          lockLocalResetControls
          tutorialMode
        />
      </SuppressPaymentDiscovery>
      <TutorialSpotlight target={spotlightTarget} visible={!finished && !stepDone} />
      <aside className={classes.guide} aria-label={copy.label} data-testid="first-game-guide">
        {minimized && !finished ? (
          <button type="button" className={classes.restore} onClick={() => setMinimized(false)}>
            {copy.restore} · {copy.step(index + 1, lessons.length)}
          </button>
        ) : (
          <>
            <div className={classes.topline}>
              <span>
                {copy.label} · {copy.step(index + 1, lessons.length)}
              </span>
              {!finished ? (
                <button type="button" onClick={() => setMinimized(true)} aria-label={copy.minimize}>
                  −
                </button>
              ) : null}
            </div>
            {finished ? (
              <>
                <h1>{copy.label}</h1>
                <p>{skipped ? copy.skip : handsOn.done}</p>
                <a className={classes.primary} href="/cyberpunk/matchmaking">
                  {handsOn.returnToLobby}
                </a>
              </>
            ) : (
              <>
                <h1>{stepCopy.title}</h1>
                <p className={classes.desktopText} data-testid="first-game-desktop">
                  {stepCopy.desktop}
                </p>
                <p className={classes.mobileText} data-testid="first-game-mobile">
                  {stepCopy.mobile}
                </p>
                {actionRequired ? (
                  <p className={classes.status} role="status">
                    {stepDone ? handsOn.actionDone : handsOn.tryAction}
                  </p>
                ) : null}
                <div className={classes.actions}>
                  {index > 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setIndex(index - 1);
                        setActionDone(false);
                        setPaymentStage("awaitEnable");
                        setPaymentDone(false);
                      }}
                    >
                      {copy.back}
                    </button>
                  ) : null}
                  <button
                    type="button"
                    className={classes.primary}
                    disabled={actionRequired && !stepDone}
                    onClick={next}
                  >
                    {index === lessons.length - 1 ? copy.finish : copy.next}
                  </button>
                  <button type="button" onClick={dismiss}>
                    {copy.skip}
                  </button>
                </div>
              </>
            )}
          </>
        )}
      </aside>
    </main>
  );
}
