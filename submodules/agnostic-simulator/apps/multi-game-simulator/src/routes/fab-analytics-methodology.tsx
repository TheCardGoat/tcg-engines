import {
  FAB_COMBAT_VALUE_FORMULA,
  FAB_COMBAT_VALUE_METHOD,
} from "../games/flesh-and-blood/FabCombatValue";
import "../games/flesh-and-blood/FabPostGameSummary.css";

export function meta() {
  return [
    { title: "Flesh and Blood analytics methodology | TCG Online" },
    {
      name: "description",
      content:
        "How TCG Online calculates Flesh and Blood combat value, damage, defense and turn statistics, including the limits of the pilot.",
    },
  ];
}

export default function FabAnalyticsMethodology() {
  return (
    <main className="fab-post-game-summary fab-analytics-methodology">
      <article>
        <a href="/flesh-and-blood/simulator">Flesh and Blood simulator</a>
        <h1>How we calculate Flesh and Blood analytics</h1>
        <p>
          Analytics should help you understand an exchange. Every number needs a definition, and
          every estimate needs its limits. This page documents {FAB_COMBAT_VALUE_METHOD} of observed
          combat value and the statistics around it.
        </p>
        <nav aria-label="On this page">
          <a href="#combat-value">Combat value</a>
          <a href="#example">Worked example</a>
          <a href="#limits">Limits</a>
          <a href="#data">Data and other statistics</a>
        </nav>
        <section id="combat-value">
          <h2>Observed combat value</h2>
          <p>
            <strong>{FAB_COMBAT_VALUE_FORMULA}.</strong>
          </p>
          <p>
            This is a descriptive total of recorded combat output. It is not a win probability, a
            skill rating, or a measure of how close you came to the best available play.
          </p>
          <dl>
            <dt>Attack power presented</dt>
            <dd>
              The sum of final attack power recorded when combat damage is resolved, before
              subtracting defense or prevention. A fully blocked attack still contributes. An attack
              that ends before that event contributes no attack power here.
            </dd>
            <dt>Other damage dealt</dt>
            <dd>
              Total damage dealt minus attack damage dealt. This avoids adding attack damage again
              after counting attack power. It includes recorded arcane and generic damage that
              actually landed; prevented non-attack damage is not added to the attacking player’s
              output.
            </dd>
            <dt>Effective defense</dt>
            <dd>
              For each resolved attack, the smaller of attack power and total defense. Six defense
              against four power contributes four points. The remaining two are overblock, not
              additional points.
            </dd>
            <dt>Damage prevented</dt>
            <dd>
              Damage actually stopped by prevention effects, recorded separately from defense. We
              count the amount prevented, not the printed capacity of a shield.
            </dd>
          </dl>
          <p>
            Resource generation and spending do not add points. Equipment and permanent
            contributions are included in the output where recorded, without pretending they were
            fresh cards spent from hand.
          </p>
        </section>
        <section id="example">
          <h2>A worked example</h2>
          <p>
            Suppose you present a six-power attack, all of which is blocked. Elsewhere in the game
            you deal two arcane damage, defend for four against a six-power attack, and prevent its
            remaining two damage.
          </p>
          <p>
            <strong>
              6 presented + 2 other damage + 4 effective defense + 2 prevented = 14 observed combat
              value.
            </strong>
          </p>
          <p>
            The blocked attack contributes six, even though it dealt zero. The two arcane damage are
            added once. Pitching a blue to fund a play does not add another three points.
          </p>
        </section>
        <section id="limits">
          <h2>What this pilot cannot tell you</h2>
          <p>
            <strong>A larger total does not prove better play.</strong> Longer games naturally
            accumulate more output. Heroes, matchups, available cards, and strategic goals all
            affect what a sensible line looks like.
          </p>
          <ul>
            <li>
              The input aggregates can include attacks or damage to allies and other non-hero
              targets, and damage to yourself. They are not restricted to productive pressure
              against the opposing hero.
            </li>
            <li>
              Attack power is measured before prevention, while other offensive damage is measured
              after prevention. This asymmetry can understate arcane pressure. Avoid comparing hero
              styles using this total.
            </li>
            <li>
              Healing, on-hit utility, disruption, card draw, arsenal setup, pitch stacking, fatigue
              plans, and future permanent value receive no estimated points. Their later recorded
              combat output can contribute.
            </li>
            <li>
              Preventing an important on-hit or preserving a future turn can justify lower immediate
              output. Overblock is not automatically a mistake.
            </li>
            <li>
              We do not distribute shared output among buffs, resource cards, equipment, and
              attacks. Individual-card attribution is outside this pilot.
            </li>
          </ul>
          <h3>Why there is no per-card grade</h3>
          <p>
            Three value per card is a common strategic reference, based partly on three-defense
            cards. It is not a measured universal average, and it is not comparable to our game or
            turn totals.
          </p>
          <p>
            Our play and defend counters overlap for defense reactions and include equipment
            defenses. Adding played + pitched + defended would produce a misleading denominator. We
            are withholding a per-card ratio until card commitments can be counted consistently.
          </p>
          <h3 id="turn-highlights">Turns and averages</h3>
          <p>
            Head-to-head adds two highlights: average combat value per recorded game turn, and the
            highest single-turn combat value for each player. The top value shows its turn number;
            an asterisk (*) marks a partial turn. Ties show the earliest recorded turn. These are
            output measures, not per-card efficiency or a ranking of player skill.
          </p>
          <p>
            Each row is one recorded game turn, showing both players’ output during that turn. It is
            not a paired defense-and-offense cycle. The game total is the sum of these rows; the
            average is that total divided by the number of recorded rows, including zero-output rows
            present in the records, the opening turn, and any partial final turn. We label
            unfinished turns as partial. Missing turns cannot be reconstructed from aggregate totals
            alone.
          </p>
        </section>
        <section id="data">
          <h2>Where the data comes from</h2>
          <p>
            The pilot uses backend aggregates built from committed engine events. We require both
            players’ turn records and matching component totals. If records are missing or
            inconsistent, we show “Unavailable” rather than substituting a zero or estimating from
            session logs. Matching totals check internal consistency; they do not guarantee that
            every event was captured correctly.
          </p>
          <p>
            Illustrative fixtures are explicitly marked and are not player results. Existing summary
            sections can also contain labeled illustrative data when real records are unavailable.
            Observed combat value is not inferred from those sections.
          </p>
          <dl>
            <dt>Attack damage and hits</dt>
            <dd>
              Damage recorded by attack-hit events, and the number of those hits. The attacks
              counter counts resolved-combat events, so attacks that end earlier may not appear.
            </dd>
            <dt>Cards played, pitched, and defended</dt>
            <dd>
              Counts of their respective events, not unique physical cards. A defense reaction can
              appear in both played and defended; equipment can appear in defended.
            </dd>
            <dt>Resources</dt>
            <dd>
              Generated resources and spent resources are separate recorded totals. Neither is
              converted into combat-value points.
            </dd>
            <dt>Life totals</dt>
            <dd>
              Reconstructed from the starting-life seed and recorded damage, life gains and life
              losses, with values floored at zero. An incorrect seed or missing event can make the
              chart inaccurate.
            </dd>
          </dl>
          <p>
            The pilot is calculated per game. Existing match totals do not imply a match-wide
            combat-value grade. This methodology describes {FAB_COMBAT_VALUE_METHOD}; changes to the
            formula should receive a new visible method version.
          </p>
        </section>
        <section>
          <h2>Concept and rules references</h2>
          <p>
            Our formula is a TCG Online convention, not an official Flesh and Blood rule or
            endorsement.
          </p>
          <ul>
            <li>
              <a href="https://fabtcg.com/articles/equipped-battle/">
                Yuki Lee Bender: Equipped for Battle, published by LSS
              </a>{" "}
              — hand value, damage presented, and the importance of context.
            </li>
            <li>
              <a href="https://redriotgames.ca/blogs/news/value-and-modularity-in-flesh-and-blood-a-wounded-bull-case-study">
                Value and Modularity in Flesh and Blood
              </a>{" "}
              — the three-point heuristic and combining cards.
            </li>
            <li>
              <a href="https://rules.fabtcg.com/en/cr/07-combat/#cr7.5">Comprehensive Rules §7.5</a>{" "}
              — combat damage and defense.
            </li>
            <li>
              <a href="https://rules.fabtcg.com/en/cr/04-game-structure/#cr4.4.3f">
                Comprehensive Rules §4.4.3f
              </a>{" "}
              — end-of-turn draw and the first-turn exception.
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
