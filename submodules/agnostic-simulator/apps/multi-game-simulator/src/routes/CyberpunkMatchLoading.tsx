import brandMark from "../games/cyberpunk/assets/icon-tcg-clean.png";
import styles from "./CyberpunkMatchLoading.module.css";

export function CyberpunkMatchLoading() {
  return (
    <main className={styles.page} role="status" aria-live="polite" aria-busy="true">
      <div className={styles.content}>
        <img className={styles.monogram} src={brandMark} alt="" width="72" height="72" />
        <div className={styles.rule} aria-hidden="true" />
        <h1 className={styles.title}>Loading match</h1>
        <p className={styles.message}>Connecting to the Cyberpunk table…</p>
      </div>
    </main>
  );
}
