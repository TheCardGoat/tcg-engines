import { useMemo, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import {
  AI_STRATEGIES,
  DEFAULT_AUTOMATED_ACTION_STRATEGY_ID,
  DEFAULT_BOT_PRACTICE_DECK_ID,
  DEFAULT_PLAYER_PRACTICE_DECK_ID,
  PRACTICE_DECK_FIXTURES,
  createPracticeMatchConfig,
  getStrategyById,
  savePracticeMatchConfig,
  type StrategyDescriptor,
} from "../engine";
import classes from "./Practice.module.css";

export function PracticePage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialBotStrategyId = normalizeStrategyId(searchParams.get("botStrategyId"));
  const [playerDeckFixtureId, setPlayerDeckFixtureId] = useState(DEFAULT_PLAYER_PRACTICE_DECK_ID);
  const [botDeckFixtureId, setBotDeckFixtureId] = useState(DEFAULT_BOT_PRACTICE_DECK_ID);
  const [botStrategyId, setBotStrategyId] =
    useState<StrategyDescriptor["id"]>(initialBotStrategyId);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const strategyDescription = useMemo(
    () => getStrategyById(botStrategyId)?.description ?? "Pick how the AI decides each turn.",
    [botStrategyId],
  );

  const startPracticeMatch = () => {
    if (!playerDeckFixtureId) {
      setError("Choose a deck before starting practice.");
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const config = createPracticeMatchConfig({
        playerDeckFixtureId,
        botDeckFixtureId,
        botStrategyId,
      });
      savePracticeMatchConfig(config);
      void navigate(`/practice/${config.matchId}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to start practice match.");
      setLoading(false);
    }
  };

  return (
    <main className={classes.page} data-testid="practice-setup">
      <div className={classes.shell}>
        <header className={classes.header}>
          <p className={classes.eyebrow}>Cyberpunk · practice</p>
          <h1 className={classes.title} data-testid="practice-setup-title">
            Practice match
          </h1>
          <p className={classes.lead}>
            Launch a fresh local game against the AI. Both seats use valid fixture decks, and the
            match starts from the real setup flow with mulligans and manual Gig choices.
          </p>
        </header>

        <section className={classes.panel} aria-label="Practice match setup">
          <div className={classes.grid}>
            <label className={classes.field}>
              <span className={classes.label}>Your deck</span>
              <select
                className={classes.select}
                data-testid="practice-setup-your-deck"
                name="yourDeck"
                value={playerDeckFixtureId}
                onChange={(event) => setPlayerDeckFixtureId(event.currentTarget.value)}
              >
                {PRACTICE_DECK_FIXTURES.map((fixture) => (
                  <option key={fixture.id} value={fixture.id}>
                    {fixture.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={classes.field}>
              <span className={classes.label}>Bot deck</span>
              <select
                className={classes.select}
                data-testid="practice-setup-bot-deck"
                name="botDeck"
                value={botDeckFixtureId}
                onChange={(event) => setBotDeckFixtureId(event.currentTarget.value)}
              >
                {PRACTICE_DECK_FIXTURES.map((fixture) => (
                  <option key={fixture.id} value={fixture.id}>
                    {fixture.label}
                  </option>
                ))}
              </select>
            </label>

            <label className={classes.field}>
              <span className={classes.label}>Bot strategy</span>
              <select
                className={classes.select}
                data-testid="practice-setup-bot-strategy"
                name="botStrategy"
                value={botStrategyId}
                onChange={(event) =>
                  setBotStrategyId(event.currentTarget.value as StrategyDescriptor["id"])
                }
              >
                {AI_STRATEGIES.map((strategy) => (
                  <option key={strategy.id} value={strategy.id}>
                    {strategy.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <p
            className={classes.help}
            data-testid="practice-setup-strategy-desc"
            data-strategy-id={botStrategyId}
          >
            {strategyDescription}
          </p>

          <button
            type="button"
            className={classes.button}
            data-testid="practice-setup-start"
            disabled={loading || !playerDeckFixtureId}
            onClick={startPracticeMatch}
          >
            {loading ? "Booting match…" : "Start practice match"}
          </button>

          {error ? (
            <div className={classes.error} role="alert" data-testid="practice-setup-error">
              {error}
            </div>
          ) : null}
        </section>

        <Link className={classes.backLink} to="/" data-testid="practice-setup-back">
          Back to board states
        </Link>
        <Link className={classes.backLink} to="/decks" data-testid="practice-setup-browse-decks">
          Browse public decks
        </Link>
      </div>
    </main>
  );
}

function normalizeStrategyId(value: string | null): StrategyDescriptor["id"] {
  return value && getStrategyById(value)
    ? (value as StrategyDescriptor["id"])
    : DEFAULT_AUTOMATED_ACTION_STRATEGY_ID;
}
