# Cyberpunk TCG: spend, ATTACK, and PLAY trigger ordering

Verified against the official rules and FAQ feeds on **15 October 2026**.
The rules feed reports an update of 1 September 2026; the FAQ feed reports
15 September 2026.

This guide explains Pepe Najarro with two Zetatech Faceplates, and Heywood
Ripperdoc played using a Legend equipped with Faceplate. Rule explanations,
FAQ questions, and card abilities are paraphrased unless explicitly quoted.
The worked examples are applications of the cited rules and FAQs, rather
than additional publisher-issued card rulings.

## The ruling

When several effects you control are pending, you choose which resolves
next. **CR 10.12** states:

> If you have multiple pending effects, you may resolve them in any order.

Once you begin one effect, complete it before resolving another. Declaring
an attack, completing the action of playing a Unit, and resolving that
Unit's ATTACK or PLAY ability are separate parts of the sequence.

| Situation | Resolution order | Authority |
| --- | --- | --- |
| An attacker has an ATTACK ability and an equipped Faceplate | Choose between the pending ATTACK and spend effects. | CR 11.21.2.1, 10.12; Faceplate FAQ F2 below |
| A Legend pays for a Unit and triggers Faceplate; that Unit has PLAY | Complete the Unit play, then choose between its PLAY and the payment spend effects. | CR 4.6, 11.20.2, 10.12; general FAQ F1 |
| A Unit or Legend is spent to activate its spend-cost ability | Finish the activated ability before resolving Faceplate. | CR 10.20.4–10.20.7, 11.15.3.2; FAQ F3 |
| A Legend pays for a Program and triggers Faceplate | Finish playing and resolving the Program before resolving Faceplate. | CR 4.14, 10.2.3–10.2.4; FAQ F4 |

Full source: [official Comprehensive Rules][rules]. These examples concern
effects controlled by the same player. If both players have pending effects,
also apply CR 10.13 and 10.14.1; choosing your effects' order does not let you
reorder your Rival's effects.

## Pepe Najarro with two Zetatech Faceplates

[Pepe Najarro: Working Doubles][pepe] has an ATTACK ability that can ready up
to two MERC Legends in your Legends area if you control a value-pair of Gigs.
A value-pair consists of two Gigs showing the same value in one Gig area
(FAQ F6).

Each [Zetatech Faceplate][faceplate] provides a separate effect when its host
is spent: adjust a Gig by up to one, then check whether you control at least
three Gigs with different values to determine whether you draw.

When Pepe is spent to attack, his ATTACK effect and both Faceplate spend
effects enter pending together. You choose their order. Resolve all of them
before the Rival's react step. **CR 11.21.2.1–11.21.2.2, 10.12; FAQs F2, F5.**

### Example: ready two Legends and draw two cards

Assume your Gigs are **2, 2, 4**, you have two eligible spent MERC Legends,
and you have enough cards remaining in your deck.

1. Resolve Pepe. The pair of 2s satisfies his condition, so ready the two Legends.
2. Resolve Faceplate A. Change one 2 to 3. Your Gigs are now **2, 3, 4**;
   its draw condition is satisfied, so draw one.
3. Resolve Faceplate B. Change 4 to 5. Your Gigs are now **2, 3, 5**;
   draw another card.

The pair is needed when Pepe resolves. After he has readied the Legends,
breaking that pair does not undo the readying. **CR 10.3.3.**

### How choosing another order changes the outcome

Keep the same starting values. In this table, A always changes the second
Gig from **2 to 3**, and B always changes the third Gig from **4 to 5**.

| Order | Ready with Pepe? | Cards drawn |
| --- | --- | --- |
| Pepe → A → B | Yes | 2 |
| Pepe → B → A | Yes | 1 |
| A → Pepe → B | No | 2 |
| A → B → Pepe | No | 2 |
| B → Pepe → A | Yes | 1 |
| B → A → Pepe | No | 1 |

B cannot draw while the values are **2, 2, 5**. If A resolves before Pepe,
it removes the only pair, so Pepe cannot ready the Legends in these examples.
Check each condition at its relevant resolution point. **CR 10.3.3, 10.15.1.**

You cannot resolve A's adjustment, pause A to resolve Pepe or B, and then
return to A's draw check. The adjustment and conditional draw belong to
one Faceplate effect. **CR 10.2, 10.2.3–10.2.4.**

The Faceplate draw condition requires at least three different Gig values;
it does not require every Gig you control to have a unique value. With four
Gigs, a pair and three different values can coexist, for example **1, 2, 3, 3**.

## Heywood Ripperdoc alongside a payment spend trigger

[Heywood Ripperdoc][ripperdoc] has a PLAY ability that optionally defeats a
Gear, then draws if that Gear's cost matches a friendly Gig's value.

Suppose you spend a Legend equipped with Faceplate to help pay for Ripperdoc:

1. Pay the cost, including spending the Legend. Faceplate triggers and waits.
2. Complete playing Ripperdoc by putting it ready on the field. Its PLAY
   effect enters pending.
3. Choose whether Faceplate or Ripperdoc's PLAY effect resolves first.

This follows **CR 4.6, 11.20.2, 10.12**. General FAQ F1 explicitly allows
ordering a Unit's PLAY effect alongside an effect triggered by spending a
friendly Legend. Applying that answer to Faceplate gives the sequence above.

### Example: the order determines whether Ripperdoc draws

Assume your only friendly Gig shows **3**, a rival has an equipped **cost-2
Gear**, and you have a card available to draw.

| Chosen order | What happens |
| --- | --- |
| Faceplate → Ripperdoc | Faceplate changes 3 to 2. Ripperdoc defeats the cost-2 Gear, finds a matching Gig, and draws one. |
| Ripperdoc → Faceplate | Ripperdoc defeats the Gear, but the Gig still shows 3, so no draw. Faceplate can change it to 2 afterward; that does not grant a delayed Ripperdoc draw. |

Ripperdoc can defeat the Gear without a matching Gig; only the draw is
conditional. FAQ F7 confirms this. His entire effect must finish before
any effects triggered by the Gear's defeat resolve. **CR 10.2.3, 10.14.**

### Why the FAQ says to play the card before Faceplate

FAQ F4 requires completing the card play before resolving the payment
Faceplate. The rules define completion differently for Units and Programs:

- A Unit's play action places it on the field (**4.6**). Its PLAY ability
  enters pending (**11.20.2**) and follows the pending-effect ordering rule
  (**10.12**), as confirmed by general FAQ F1.
- Playing a Program includes resolving its effects (**4.14**). Those effects
  therefore finish before the payment Faceplate resolves. The Program is
  outside the ordinary game areas during that resolution (**4.14.2**).

The card-play FAQ and the general PLAY/spend FAQ describe different parts of
the process. Read them together when evaluating a Unit's PLAY ability.

## Spend-to-activate abilities

A spend-cost activated ability has a different sequence. Paying its cost
may trigger Faceplate, but you finish the activated ability before resolving
the resulting pending effects. **CR 10.20.4–10.20.7, 11.15.3.2; FAQ F3.**

Spending Pepe to attack does not make his ATTACK ability a spend-cost
activated ability. Spending a Legend to pay for Ripperdoc also does not
activate that Legend's own spend-cost ability. **CR 11.15.2, 11.20.1, 11.21.1.**

## Rules reference and reading notes

These are explanations, not verbatim reproductions. Read the full passages
in the [official rules][rules] or the [repository mirror][local-rules].

| Rule | Relevance to these interactions |
| --- | --- |
| 4.6 | Defines the steps for playing a Unit. |
| 4.14, 4.14.2 | A Program resolves during its play process, before entering the trash. |
| 10.2 | Instructions within one effect are followed in their written order. |
| 10.2.3–10.2.4 | Resolving or activating an effect cannot be interrupted by another effect; newly triggered effects wait. |
| 10.3.3 | A condition within resolution is checked when that part is reached. |
| 10.11.1 | Pending effects must be dealt with before taking another game action. |
| 10.12 | The controller chooses among their pending effects. |
| 10.13, 10.14.1 | Determine which player resolves effects when both players have pending effects, including newly generated effects. |
| 10.14 | An effect triggered during resolution waits until the current effect finishes. |
| 10.15–10.15.1 | Pending effects persist through later state changes, subject to conditions that still need to hold at resolution. |
| 10.16.1–10.16.2 | Trigger conditions determine when effects enter pending; multiple triggers can enter pending together. |
| 10.20.4–10.20.7 | Separate paying for an activated ability, resolving it, and resolving the pending effects it caused. |
| 11.15.2–11.15.3.2 | Distinguish using a spend-cost ability from spending for another purpose; the activated ability resolves first. |
| 11.20.1–11.20.2 | PLAY is a triggered ability associated with playing its card. |
| 11.21.1–11.21.2.2 | ATTACK and attacker-spend effects become pending together and resolve before reactions. |

## FAQ reference

The questions below are summarized. The three quoted answers are verbatim.
For complete question and answer wording, use the [official rules FAQ page][faq-page]
or locate the listed entry ID in the [official FAQ feed][faq-feed].

| Ref | Question or issue | Publisher's answer or ruling | Official entry ID |
| --- | --- | --- | --- |
| F1 | Can a Unit's PLAY effect and an effect triggered by spending a friendly Legend be ordered freely? | Exact answer: **“Yes”**. | `3d7dd7c9-f7aa-4540-a1e7-fd65f2ea474d` |
| F2 | Faceplate's spend effect versus an equipped Unit's ATTACK effect. | Exact answer: **“You can choose the order you resolve these effects.”** | `9f87591e-514c-44ee-bba4-515fc488fb77` |
| F3 | Faceplate's spend effect versus a spend-cost activated ability. | Exact answer: **“After. Resolve the activated [Spend Icon:] effect first.”** | `9b281489-5883-47ca-80a9-fa6707655b12` |
| F4 | Faceplate triggers because a Legend pays a card's cost. | Complete the card play before resolving Faceplate. Read with F1 for a Unit's PLAY trigger. | `62c60c04-72ec-4231-9ea7-f5b8048eb4d8` |
| F5 | Faceplate when its host attacks. | Resolve it before advancing to the Rival's react step. | `a4b85193-1647-4001-a076-846f54d54481` |
| F6 | Meaning of a value-pair. | Two equal-valued Gigs in the same Gig area. | `1f2d750b-a776-4d1c-bc79-a4621ab2cf0d` |
| F7 | Can Ripperdoc defeat a Gear without a friendly Gig matching its cost? | Yes; the missing match prevents the conditional draw, not the defeat. | `89eca244-872c-4c28-bf2c-7dbf294e0e6c` |

Our [card FAQ inventory][local-faqs] preserves the card-specific questions and
answers. F1 is a general game FAQ and is available in the unfiltered official
feed; the card-only feed does not include it.

## Engine verification

[PR #4407][pr] fixes a restriction that forced payment spend triggers to wait
for a Unit's PLAY trigger. It retains the separate Program ordering.

The [regression suite][tests] covers all six Pepe/two-Faceplate orders and
both Ripperdoc/Faceplate orders with automatic and selected payment sources.
The four Ripperdoc cases reproduced the defect before the fix; the six Pepe
cases already passed. The focused validation passed 193 tests, plus checks
for formatting, lint, and types. This is local engine evidence, not proof of
a deployment or a hosted-match flow.

[rules]: https://cyberpunktcg.com/comprehensive-rules
[faq-page]: https://cyberpunktcg.com/rules-faq
[faq-feed]: https://api.netdeck.gg/api/faqs/cyberpunk
[pepe]: https://cyberpunktcg.com/cards/pepe-najarro-working-doubles
[faceplate]: https://cyberpunktcg.com/cards/zetatech-faceplate
[ripperdoc]: https://cyberpunktcg.com/cards/heywood-ripperdoc
[local-rules]: ../.agents/skills/cyberpunk-tcg-rules/references/comprehensive-rules.md
[local-faqs]: card-faq-inventory.md
[tests]: ../packages/engine/tests/comprehensive-rules/spend-trigger-order.test.ts
[pr]: https://github.com/TheCardGoat/the-card-goat-online/pull/4407
