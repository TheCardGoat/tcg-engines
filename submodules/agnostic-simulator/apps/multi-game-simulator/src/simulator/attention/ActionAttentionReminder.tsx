import { useCallback, useEffect, useRef, useState } from "react";
import { BellRing, BellOff, X } from "lucide-react";
import { Button } from "@mantine/core";
import { playActionAttentionSound } from "@tcg/simulator-presentation/audio/sound-service";
import type { ActionAttention } from "./action-attention";
import classes from "./ActionAttentionReminder.module.css";

const FIRST_REMINDER_MS = 60_000;
const FINAL_REMINDER_MS = 90_000;
const SOUND_REPEAT_MS = 7_000;
const SOUND_COOLDOWN_MS = 1_000;
const ENABLED_STORAGE_KEY = "simulator.actionAttention.enabled";
const SOUND_STORAGE_KEY = "simulator.actionAttention.soundEnabled";

function readPreference(key: string): boolean {
  try {
    return window.localStorage.getItem(key) !== "false";
  } catch {
    return true;
  }
}

export function ActionAttentionReminder({
  decision,
  onShowAction,
  onThinking,
}: {
  readonly decision: ActionAttention | null;
  readonly onShowAction?: () => void;
  readonly onThinking?: () => void;
}) {
  const [enabled, setEnabled] = useState(() => readPreference(ENABLED_STORAGE_KEY));
  const [soundEnabled, setSoundEnabled] = useState(() => readPreference(SOUND_STORAGE_KEY));
  const [stage, setStage] = useState<0 | 1 | 2>(0);
  const [visibleKey, setVisibleKey] = useState<string | null>(null);
  const [dismissedKey, setDismissedKey] = useState<string | null>(null);
  const [interactionNonce, setInteractionNonce] = useState(0);
  const activeKeyRef = useRef<string | null>(null);
  const lastSoundAtRef = useRef(-Infinity);
  const key = decision?.key ?? null;
  const soundActive =
    key !== null &&
    enabled &&
    soundEnabled &&
    dismissedKey !== key &&
    stage > 0 &&
    visibleKey === key;
  activeKeyRef.current = soundActive ? key : null;

  useEffect(
    () => () => {
      activeKeyRef.current = null;
    },
    [],
  );

  const sound = useCallback(
    (forKey: string) => {
      if (!soundEnabled || lastSoundAtRef.current + SOUND_COOLDOWN_MS > Date.now()) return;
      lastSoundAtRef.current = Date.now();
      playActionAttentionSound(() => activeKeyRef.current === forKey);
    },
    [soundEnabled],
  );

  useEffect(() => {
    if (!key) {
      setDismissedKey(null);
      setStage(0);
      setVisibleKey(null);
      return;
    }
    setStage(0);
    setVisibleKey(null);
  }, [key]);

  useEffect(() => {
    if (!key || !soundActive) return;
    sound(key);
    const interval = setInterval(() => sound(key), SOUND_REPEAT_MS);
    return () => clearInterval(interval);
  }, [key, soundActive, sound]);

  useEffect(() => {
    if (!key || !enabled || dismissedKey === key) return;
    const first = setTimeout(() => {
      setStage(1);
      setVisibleKey(key);
    }, FIRST_REMINDER_MS);
    const final = setTimeout(() => {
      setStage(2);
    }, FINAL_REMINDER_MS);
    const reset = (event: PointerEvent | KeyboardEvent) => {
      if (
        event.target instanceof Element &&
        event.target.closest("[data-action-attention-reminder]")
      )
        return;
      setStage(0);
      setVisibleKey(null);
      setInteractionNonce((value) => value + 1);
    };
    document.addEventListener("pointerdown", reset);
    document.addEventListener("keydown", reset);
    return () => {
      clearTimeout(first);
      clearTimeout(final);
      document.removeEventListener("pointerdown", reset);
      document.removeEventListener("keydown", reset);
    };
  }, [dismissedKey, enabled, interactionNonce, key]);

  const showAction =
    onShowAction ??
    (() => {
      const target = document.querySelector<HTMLElement>("[data-action-attention-target]");
      target?.scrollIntoView({ block: "nearest", behavior: "smooth" });
      target?.focus({ preventScroll: true });
    });

  if (!decision || dismissedKey === key) return null;

  if (!enabled) {
    return (
      <button
        className={classes.off}
        type="button"
        onClick={() => {
          window.localStorage.setItem(ENABLED_STORAGE_KEY, "true");
          setEnabled(true);
        }}
        aria-label="Turn on action reminders"
      >
        <BellOff size={15} aria-hidden="true" /> Reminders off
      </button>
    );
  }

  if (stage === 0 || visibleKey !== key) return null;

  return (
    <aside
      className={classes.root}
      role="status"
      aria-live={stage === 1 ? "polite" : "off"}
      data-action-attention-reminder
      data-testid="action-attention-reminder"
      data-stage={stage}
    >
      <div className={classes.heading}>
        <BellRing size={17} aria-hidden="true" />
        <strong>{decision.label}</strong>
        {stage > 0 ? (
          <button
            type="button"
            className={classes.close}
            aria-label="Dismiss reminder for this decision"
            onClick={() => setDismissedKey(key)}
          >
            <X size={16} aria-hidden="true" />
          </button>
        ) : null}
      </div>
      {stage > 0 ? (
        <div className={classes.detail}>
          <p>The game is waiting for you.</p>
          <div className={classes.actions}>
            <Button size="compact-sm" onClick={showAction}>
              Show action
            </Button>
            {onThinking ? (
              <Button
                size="compact-sm"
                variant="default"
                onClick={() => {
                  onThinking();
                  setDismissedKey(key);
                }}
              >
                I’m thinking
              </Button>
            ) : null}
          </div>
          <label className={classes.sound}>
            <input
              type="checkbox"
              checked={soundEnabled}
              onChange={(event) => {
                const next = event.currentTarget.checked;
                window.localStorage.setItem(SOUND_STORAGE_KEY, String(next));
                setSoundEnabled(next);
              }}
            />{" "}
            Reminder sound
          </label>
          <button
            type="button"
            className={classes.disable}
            onClick={() => {
              window.localStorage.setItem(ENABLED_STORAGE_KEY, "false");
              setEnabled(false);
            }}
          >
            Turn off reminders
          </button>
        </div>
      ) : null}
    </aside>
  );
}
