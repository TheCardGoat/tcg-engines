import { useEffect, useRef, useState, type ReactNode } from "react";
import { PostGameModal } from "@tcg/simulator-ui";
import type { AcSeat, AlphaClashResult, LiveBoardState } from "./components/board-types";
import { cardArtwork } from "./components/Arena3D/card-artwork";
import { alphaClashResultCopy } from "./post-game-result";
import { useSimulatorAudio } from "../../simulator/audio";
import classes from "./AlphaClashPostGameSummary.module.css";

interface Props {
  readonly gameId: string;
  readonly result?: AlphaClashResult;
  readonly board: Pick<LiveBoardState, "cards" | "players" | "turnNumber">;
  readonly viewer: AcSeat;
  readonly names: Readonly<Record<AcSeat, string>>;
  readonly hotSeat?: boolean;
  readonly busy?: boolean;
  readonly remote?: boolean;
  readonly meta?: ReactNode;
  readonly actions: ReactNode;
}

/** Mounted only for a finished game; keep it mounted when inspecting the board. */
export function AlphaClashPostGameSummary({
  gameId,
  result,
  board,
  viewer,
  names,
  hotSeat = false,
  busy = false,
  remote = false,
  meta,
  actions,
}: Props) {
  const [dismissed, setDismissed] = useState(false);
  const [settled, setSettled] = useState(false);
  const [deadline, setDeadline] = useState(false);
  const sounded = useRef(false);
  const launcher = useRef<HTMLButtonElement>(null);
  const { playCue } = useSimulatorAudio();
  const copy = alphaClashResultCopy(result, viewer, hotSeat);
  const opponent: AcSeat = viewer === "player-one" ? "player-two" : "player-one";
  // Give the board one render to start the final motion, then wait for it to drain.
  useEffect(() => {
    const settle = setTimeout(() => setSettled(true), 250);
    const fallback = setTimeout(() => setDeadline(true), 1500);
    return () => {
      clearTimeout(settle);
      clearTimeout(fallback);
    };
  }, []);
  const ready = settled && (!busy || deadline);
  const open = ready && !dismissed;
  useEffect(() => {
    if (!ready || !result || sounded.current || hotSeat) return;
    sounded.current = true;
    playCue(result.winner === viewer ? "game.win" : "game.loss");
  }, [ready, result, hotSeat, viewer, playCue]);

  const participant = (seat: AcSeat, side: string) => {
    const contender = board.cards.find(
      (card) => card.controller === seat && card.zone === "contender" && !card.faceDown,
    );
    const image = contender ? cardArtwork(contender) : undefined;
    return (
      <section className={classes.participant} data-side={seat === viewer ? "self" : "opponent"}>
        {image && <img src={image} alt={contender?.name ?? "Contender"} />}
        <div>
          <span className={classes.side}>{side}</span>
          <strong>{contender?.name ?? "Contender"}</strong>
          <span className={classes.playerName}>{names[seat]}</span>
          <div className={classes.health}>
            <b>{board.players[seat].health}</b> health remaining
          </div>
        </div>
      </section>
    );
  };
  return (
    <>
      <button
        ref={launcher}
        className={classes.launcher}
        hidden={!ready || open}
        onClick={() => setDismissed(false)}
      >
        View summary
      </button>
      <PostGameModal
        open={open}
        layout="compact"
        className={classes.modal}
        outcome={copy.outcome}
        title={copy.title}
        reason={copy.reason}
        celebrate={false}
        celebrationKey={gameId}
        testId="ac-post-game-summary"
        dataEndReason={result?.reason}
        dataRemote={String(remote)}
        returnFocusRef={launcher}
        onClose={() => setDismissed(true)}
        participants={{
          left: participant(viewer, hotSeat ? names[viewer] : "You"),
          right: participant(opponent, hotSeat ? names[opponent] : "Opponent"),
        }}
        meta={
          <>
            <span>{remote ? "Hosted game" : "Local practice"}</span>
            <span>Turn {board.turnNumber}</span>
            {meta}
          </>
        }
        sections={[
          {
            id: "final-board",
            label: "Final board",
            content: (
              <table className={classes.comparison}>
                <thead>
                  <tr>
                    <th scope="col">{hotSeat ? names[viewer] : "You"}</th>
                    <th scope="col">Public state</th>
                    <th scope="col">{hotSeat ? names[opponent] : "Opponent"}</th>
                  </tr>
                </thead>
                <tbody>
                  {(
                    [
                      ["health", "Contender health"],
                      ["deckSize", "Cards in deck"],
                      ["handSize", "Cards in hand"],
                    ] as const
                  ).map(([field, label]) => (
                    <tr key={field}>
                      <td>{board.players[viewer][field]}</td>
                      <th scope="row">{label}</th>
                      <td>{board.players[opponent][field]}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ),
          },
        ]}
        actions={
          <div className={classes.actions}>
            <button onClick={() => setDismissed(true)}>Inspect board</button>
            {actions}
          </div>
        }
      />
    </>
  );
}
