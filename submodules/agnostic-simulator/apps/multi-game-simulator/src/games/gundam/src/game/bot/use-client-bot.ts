import { useEffect, useState } from "react";

import type { MatchRuntime, MatchStaticResources } from "@tcg/gundam-engine";

import type { DevRuntimeBotHandle } from "../dev-runtime.ts";
import type { SnapshotBotConfig } from "../snapshot.ts";
import { BOT_ATTACHERS } from "./bot-registry.ts";

/**
 * Attach a bot to a reconstructed-from-snapshot `MatchRuntime` on the
 * client, post-hydration. Returns `undefined` during SSR and on the
 * first pre-effect render — the bot subscribes to runtime state +
 * schedules setTimeout callbacks, both of which are meaningless
 * server-side and would leak subscribers between requests.
 *
 * The effect's cleanup calls `attached.dispose()` unconditionally
 * (not just the UI-facing handle) so auto-pass subscriptions are
 * also detached on unmount / HMR / route navigation — the previous
 * version only disposed strategy-bot handles, leaking
 * `runtime.onStateUpdate` listeners for every auto-pass fixture.
 *
 * Fixtures absent from the registry intentionally lose their bot
 * behavior after hydration — see the registry's docs for the
 * trade-off and the current allowlist.
 */
export function useClientBot(
  fixtureName: string,
  hasBot: boolean,
  runtime: MatchRuntime,
  staticResources: MatchStaticResources,
  botConfig?: SnapshotBotConfig,
): DevRuntimeBotHandle | undefined {
  const [bot, setBot] = useState<DevRuntimeBotHandle | undefined>(undefined);

  // Depend on the serialized form so changing the strategy on the
  // snapshot re-runs the effect cleanly. Without this, swapping
  // strategies via URL would keep the previously-attached bot.
  const botConfigKey = botConfig ? JSON.stringify(botConfig) : "";

  useEffect(() => {
    const attacher = BOT_ATTACHERS[fixtureName];
    if (!attacher) return;
    // Bot attachers are async — they dynamic-import the bot impls so
    // the production bundle doesn't carry all bot code on the
    // critical path. Resolve the attach after the effect, flag
    // cancellation so a fast unmount/navigation cleanup always
    // disposes the in-flight attach.
    let cancelled = false;
    let disposer: (() => void) | null = null;
    void attacher(runtime, staticResources, { botConfig }).then((attached) => {
      if (cancelled) {
        attached.dispose();
        return;
      }
      disposer = attached.dispose;
      // `hasBot` only controls whether we surface the handle to the
      // UI (strategy bots do; auto-pass attachers leave `.handle`
      // absent). Side effects (subscriptions, setTimeout callbacks)
      // run regardless — that's what we want post-hydration.
      if (hasBot && attached.handle) setBot(attached.handle);
    });
    return () => {
      cancelled = true;
      disposer?.();
      disposer = null;
      setBot(undefined);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- botConfigKey captures botConfig's identity
  }, [fixtureName, hasBot, runtime, staticResources, botConfigKey]);

  return bot;
}
