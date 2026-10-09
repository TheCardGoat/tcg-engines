import { getSupporterDisplayConfig } from "@tcg/shared/supporter-display";
import {
  formatPlayerIdentityMeta,
  type PlayerConnectionInfo,
  type PlayerIdentityInfo,
} from "../../engine/sides";
import { connectionStatusLabel, connectionUiStatus } from "../../engine/live/playerConnectionState";
import { useAnimationNode } from "@tcg/simulator-ui";
import styles from "./PlayerNameplate.module.css";

export function PlayerNameplate({
  identity,
  connection,
  playerId,
  rival,
  turn,
  priority,
}: {
  identity?: PlayerIdentityInfo;
  connection?: PlayerConnectionInfo;
  playerId: string;
  rival: boolean;
  turn: boolean;
  priority: boolean;
}) {
  const name = identity?.displayName ?? (rival ? "RIVAL" : "YOU");
  const supporter = getSupporterDisplayConfig(identity?.subscriptionTier);
  const rating = formatPlayerIdentityMeta(identity);
  const status = connectionUiStatus(connection);
  const playerRef = useAnimationNode({ kind: "player", id: playerId }, { presence: "present" });
  return (
    <div ref={playerRef} className={`${styles.nameplate} ${rival ? styles.rival : styles.local}`}>
      <div className={styles.heading}>
        <strong className={styles.name} title={name}>
          {name}
        </strong>
        {supporter && (
          <span className={styles.tier} style={{ color: supporter.color }}>
            <span aria-hidden="true">✦</span> {supporter.label}
          </span>
        )}
      </div>
      {(connection || rating) && (
        <div className={styles.meta}>
          {connection && (
            <span className={styles.connection} data-status={status} role="status">
              <span className={styles.dot} aria-hidden="true" />
              {connectionStatusLabel(status)}
            </span>
          )}
          {rating && <span>{rating}</span>}
        </div>
      )}
      {(turn || priority) && (
        <div className={styles.phase}>
          {[turn && "TURN", priority && "PRIORITY"].filter(Boolean).join(" / ")}
        </div>
      )}
    </div>
  );
}
