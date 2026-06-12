<script lang="ts">
	import { deriveClockView, type ClockSnapshot } from "@tcg/lorcana-engine";
	import { useClockNow } from "@/features/simulator/model/clock-ticker.svelte.js";
	import { playSound } from "@/features/simulator/animations/sound-service.js";

	interface PlayerTimerProps {
		/** Authoritative clock snapshot for this player — emitted by the engine projection. */
		snapshot: ClockSnapshot;
		/** Visual presentation variant for timer chrome */
		variant?: "inline" | "rail";
		/** Optional visible label for rail presentation */
		label?: string;
		/** Whether this is the local player's own clock (enables low-time sound) */
		isOwnClock?: boolean;
	}

	let {
		snapshot,
		variant = "inline",
		label = "Clock",
		isOwnClock = false,
	}: PlayerTimerProps = $props();

	const clockNow = useClockNow();
	const view = $derived(deriveClockView(snapshot, clockNow.value, { isOwnClock }));

	// Low-time tick-tock warning sound (own clock only, last 10 seconds).
	// Depends only on a boolean so the effect runs on transitions, not every tick.
	$effect(() => {
		if (!view.shouldPlayLowTimeTick) return;
		playSound("clock-tick");
		const id = setInterval(() => playSound("clock-tick"), 1000);
		return () => clearInterval(id);
	});
</script>

<div
	class="player-timer {view.urgencyClass}"
	class:player-timer--active={view.isRunning}
	class:player-timer--rail={variant === "rail"}
	role="timer"
	aria-label="Player time remaining: {view.formattedTime}"
>
	{#if variant === "rail"}
		<span class="timer-label">{label}</span>
	{/if}
	<div class="timer-main">
		<span class="timer-value">{view.formattedTime}</span>
	</div>
</div>

<style>
	.player-timer {
		display: inline-flex;
		align-items: center;
		gap: 0.25rem;
		padding: 0.1rem 0.35rem;
		border-radius: 0.25rem;
		background: rgba(15, 23, 42, 0.7);
		border: 1px solid rgba(71, 85, 105, 0.4);
		font-variant-numeric: tabular-nums;
		transition:
			background 200ms ease,
			border-color 200ms ease,
			box-shadow 200ms ease;
	}

	.player-timer--active {
		border-color: rgba(59, 130, 246, 0.5);
		background: rgba(15, 23, 42, 0.9);
	}

	.player-timer--rail {
		width: 100%;
		flex-direction: column;
		align-items: flex-start;
		gap: 0.2rem;
		padding: 0.55rem 0.7rem;
		border-radius: 0.85rem;
		border-color: rgba(125, 211, 252, 0.18);
		background:
			linear-gradient(180deg, rgba(10, 20, 36, 0.96), rgba(8, 15, 27, 0.96));
		box-shadow:
			inset 0 1px 0 rgba(255, 255, 255, 0.05),
			0 12px 28px rgba(2, 6, 23, 0.28);
	}

	.player-timer--rail.player-timer--active {
		border-color: rgba(125, 211, 252, 0.4);
		box-shadow:
			0 0 0 1px rgba(56, 189, 248, 0.18),
			0 16px 32px rgba(2, 6, 23, 0.34),
			inset 0 1px 0 rgba(255, 255, 255, 0.06);
	}

	.timer-label {
		font-size: 0.64rem;
		font-weight: 800;
		line-height: 1;
		letter-spacing: 0.16em;
		text-transform: uppercase;
		color: rgba(186, 230, 253, 0.72);
	}

	.timer-main {
		display: inline-flex;
		align-items: center;
		gap: 0.35rem;
	}

	.timer-value {
		font-size: 0.82rem;
		font-weight: 700;
		color: #e2e8f0;
		line-height: 1;
	}

	.player-timer--rail .timer-value {
		font-size: 1.1rem;
		font-weight: 800;
	}

	.timer--warning .timer-value {
		color: #fbbf24;
	}

	.timer--danger .timer-value {
		color: #ef4444;
	}

	.timer--critical .timer-value {
		color: #ef4444;
		animation: pulse-critical 1s ease-in-out infinite;
	}

	@keyframes pulse-critical {
		0%,
		100% {
			opacity: 1;
		}
		50% {
			opacity: 0.5;
		}
	}

	.timeout-badge {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		min-width: 0.9rem;
		height: 0.9rem;
		padding: 0 0.15rem;
		border-radius: 999px;
		background: rgba(239, 68, 68, 0.8);
		font-size: 0.55rem;
		font-weight: 700;
		color: white;
		line-height: 1;
	}
</style>
