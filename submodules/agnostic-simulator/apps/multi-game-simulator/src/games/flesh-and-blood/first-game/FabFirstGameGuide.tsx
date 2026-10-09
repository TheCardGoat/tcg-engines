import { useLayoutEffect, useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";

import {
  fabFirstGameMessages,
  fabGuideStepIds,
  resolveTutorialLocale,
  type FabGuideStepId,
  type TutorialLocale,
} from "./messages";
import {
  FAB_FIRST_GAME_TUTORIAL_ENABLED,
  firstGameTutorialSeen,
  readTutorialLocalePreference,
  saveFirstGameTutorialResult,
} from "./storage";
import {
  guideAnchorForHighlight,
  mobileGuideFrame,
  spotlightFrame,
  type GuideBox,
} from "./spotlight";
import { fabGuideTargetSelector } from "./targets";
import classes from "./FabFirstGameGuide.module.css";

const FAB_TUTORIAL_PATH = "/flesh-and-blood/simulator/tutorial";
const FAB_PRACTICE_PATH = "/flesh-and-blood/simulator/play/practice";

function viewportIsMobile(): boolean {
  if (typeof window === "undefined" || typeof window.matchMedia !== "function") return false;
  return window.matchMedia("(max-width: 767px)").matches;
}

function useGuideSpotlight(step: FabGuideStepId, visible: boolean): GuideBox | null {
  const [rect, setRect] = useState<GuideBox | null>(null);

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
        const next = openSurface
          ? null
          : spotlightFrame(
              Array.from(
                document.querySelectorAll<HTMLElement>(
                  fabGuideTargetSelector(step, viewportIsMobile()),
                ),
              )
                .map((element) => element.getBoundingClientRect())
                .filter((box) => box.width > 0 && box.height > 0),
              { width: window.innerWidth, height: window.innerHeight },
            );
        setRect((previous) =>
          previous &&
          next &&
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
      attributeFilter: ["aria-label", "data-testid", "data-zone", "data-slot"],
    });
    window.addEventListener("resize", update);
    window.addEventListener("scroll", update, true);
    return () => {
      window.cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("resize", update);
      window.removeEventListener("scroll", update, true);
    };
  }, [step, visible]);

  return rect;
}

function initialStepIndex(): number {
  if (typeof window === "undefined") return 0;
  const requested = new URLSearchParams(window.location.search).get("step");
  const requestedIndex = fabGuideStepIds.indexOf(requested as FabGuideStepId);
  return requestedIndex < 0 ? 0 : requestedIndex;
}

export function FabFirstGameGuide({ children }: { children?: ReactNode }) {
  const locale = useMemo(
    () => resolveTutorialLocale(readTutorialLocalePreference(), navigator.languages),
    [],
  );
  const copy = fabFirstGameMessages[locale];
  const [index, setIndex] = useState(initialStepIndex);
  const [finished, setFinished] = useState(false);
  const [skipped, setSkipped] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const stepId = fabGuideStepIds[index] ?? fabGuideStepIds[0];
  const stepCopy = copy.steps[stepId];
  const highlight = useGuideSpotlight(stepId, !finished);
  const mobile = viewportIsMobile();
  const guideFrame =
    mobile && highlight
      ? mobileGuideFrame(guideAnchorForHighlight(highlight, window.innerHeight), {
          width: window.innerWidth,
          height: window.innerHeight,
        })
      : null;

  const restart = () => {
    setFinished(false);
    setSkipped(false);
    setMinimized(false);
    setIndex(0);
  };

  const dismiss = () => {
    saveFirstGameTutorialResult("dismissed");
    setSkipped(true);
    setFinished(true);
  };

  const next = () => {
    if (index >= fabGuideStepIds.length - 1) {
      saveFirstGameTutorialResult("completed");
      setSkipped(false);
      setFinished(true);
      return;
    }
    setIndex(index + 1);
  };

  return (
    <main
      className={classes.page}
      data-testid="fab-first-game-tutorial"
      data-step={finished ? undefined : stepId}
    >
      {children}
      {highlight ? (
        <div
          aria-hidden="true"
          className={classes.spotlight}
          data-testid="fab-first-game-spotlight"
          style={highlight}
        />
      ) : null}
      <aside
        className={classes.guide}
        aria-label={copy.label}
        data-testid="fab-first-game-guide"
        data-guide-anchor={guideFrame ? (guideFrame.top > 8 ? "bottom" : "top") : undefined}
        style={
          guideFrame
            ? {
                top: guideFrame.top,
                left: guideFrame.left,
                width: guideFrame.width,
                height: guideFrame.height,
                maxHeight: guideFrame.height,
                right: "auto",
                bottom: "auto",
              }
            : undefined
        }
      >
        {minimized && !finished ? (
          <button type="button" className={classes.restore} onClick={() => setMinimized(false)}>
            {copy.restore} · {copy.step(index + 1, fabGuideStepIds.length)}
          </button>
        ) : (
          <>
            <div className={classes.topline}>
              <span>
                {copy.label} · {copy.step(index + 1, fabGuideStepIds.length)}
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
                <p>{skipped ? copy.skip : copy.done}</p>
                <div className={classes.actions}>
                  <button type="button" className={classes.primary} onClick={restart}>
                    {copy.replay}
                  </button>
                  <Link className={classes.primary} to={FAB_PRACTICE_PATH}>
                    {copy.returnToPractice}
                  </Link>
                </div>
              </>
            ) : (
              <>
                <h1>{stepCopy.title}</h1>
                <p className={classes.desktopText} data-testid="fab-first-game-desktop">
                  {stepCopy.desktop}
                </p>
                <p className={classes.mobileText} data-testid="fab-first-game-mobile">
                  {stepCopy.mobile}
                </p>
                <div className={classes.actions}>
                  {index > 0 ? (
                    <button type="button" onClick={() => setIndex(index - 1)}>
                      {copy.back}
                    </button>
                  ) : null}
                  <button type="button" className={classes.primary} onClick={next}>
                    {index === fabGuideStepIds.length - 1 ? copy.finish : copy.next}
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

export function FabFirstGameEntry({ surface }: { surface: "setup" | "board" }) {
  const [seen, setSeen] = useState(() =>
    typeof window === "undefined" ? false : firstGameTutorialSeen(),
  );
  const [locale] = useState<TutorialLocale>(() =>
    resolveTutorialLocale(
      typeof window === "undefined" ? null : readTutorialLocalePreference(),
      typeof navigator === "undefined" ? [] : navigator.languages,
    ),
  );

  const copy = fabFirstGameMessages[locale];
  const dismiss = () => {
    saveFirstGameTutorialResult("dismissed");
    setSeen(true);
  };

  if (!FAB_FIRST_GAME_TUTORIAL_ENABLED) return null;

  if (seen) {
    if (surface === "board") return null;
    return (
      <Link
        className={classes.replayLink}
        to={FAB_TUTORIAL_PATH}
        data-testid="fab-first-game-replay"
      >
        {copy.replay}
      </Link>
    );
  }

  return (
    <section
      className={`${classes.guide} ${classes.invitation}`}
      aria-label={copy.label}
      data-testid="fab-first-game-invitation"
    >
      <h2>{copy.label}</h2>
      <p>{copy.invitation}</p>
      <div className={classes.actions}>
        <Link className={classes.primary} to={FAB_TUTORIAL_PATH} onClick={dismiss}>
          {copy.start}
        </Link>
        <button type="button" onClick={dismiss}>
          {copy.skip}
        </button>
      </div>
    </section>
  );
}
