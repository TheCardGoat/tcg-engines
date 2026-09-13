/**
 * Fixed, rule-legal 50-card test decks for bot/automation games — one per
 * color archetype. Every deck uses a mono-color leader so all main-deck cards
 * satisfy the leader-color construction rule, holds at most 4 copies per
 * canonical card, and packs interaction (counter characters, [Counter]
 * events, [Blocker]/[Rush] characters, [Trigger] cards) so bot matches
 * exercise blockers, counters, and triggers.
 *
 * Pure data: ids refer to base printings in @tcg/op-cards.
 */

export interface TestDeckDefinition {
  leaderId: string;
  mainDeck: string[]; // 50 card ids, duplicates allowed up to 4x per canonicalId
  description: string;
}

export type TestDeckId =
  | "red-aggro"
  | "blue-control"
  | "green-midrange"
  | "purple-ramp"
  | "black-removal"
  | "yellow-trigger";

export const TEST_DECKS: Record<TestDeckId, TestDeckDefinition> = {
  "red-aggro": {
    leaderId: "OP01-001", // Roronoa Zoro — red, 5 life: [DON!! x1] your Characters +1000
    description:
      "Mono-red Straw Hat aggro. Low curve of 1-3 cost beaters, Rush attackers " +
      "(OP01-025 Zoro, ST01-012 Luffy) and cheap [Counter] power-pump events to " +
      "close games before the opponent stabilizes.",
    mainDeck: [
      // 1-drops (12)
      "EB01-005",
      "EB01-005",
      "EB01-005",
      "EB01-005", // Doma 1/3000 +1000
      "OP01-016",
      "OP01-016",
      "OP01-016",
      "OP01-016", // Nami 1/2000 +2000, Straw Hat search
      "OP04-007",
      "OP04-007",
      "OP04-007",
      "OP04-007", // Sanji 1/3000 +1000
      // 2-drops (12)
      "OP01-012",
      "OP01-012",
      "OP01-012",
      "OP01-012", // Sai 2/4000 +1000
      "OP01-004",
      "OP01-004",
      "OP01-004",
      "OP01-004", // Usopp 2/3000 +2000
      "OP01-019",
      "OP01-019", // Bartolomeo 2/2000 [Blocker]
      // 3-drops (14)
      "OP01-025",
      "OP01-025",
      "OP01-025",
      "OP01-025", // Roronoa Zoro 3/5000 [Rush]
      "OP03-007",
      "OP03-007",
      "OP03-007",
      "OP03-007", // Namule 3/5000 +1000
      "OP01-023",
      "OP01-023",
      "OP01-023",
      "OP01-023", // Marco 3/5000 +1000
      "OP03-014",
      "OP03-014", // Monkey.D.Garp 3/5000, plays 1-cost from hand
      // top end (4)
      "ST01-012",
      "ST01-012",
      "ST01-012",
      "ST01-012", // Monkey.D.Luffy 5/6000 [Rush]
      // events (10)
      "OP01-029",
      "OP01-029",
      "OP01-029",
      "OP01-029", // Radical Beam!! [Counter] +2000
      "OP01-026",
      "OP01-026",
      "OP01-026",
      "OP01-026", // Red Hawk [Counter] +4000 / K.O.
      "EB01-010",
      "EB01-010", // There's No Way You Could Defeat Me!! [Counter]/[Trigger] K.O.
    ],
  },

  "blue-control": {
    leaderId: "OP03-040", // Nami — blue, 5 life: wins when deck hits 0 instead of losing
    description:
      "Mono-blue control built around Nami's alternate win condition. Dense " +
      "draw/search (Kaya, Perona, Mr.2), bounce, a wall of [Blocker] characters " +
      "(Ms. All Sunday, Doflamingo, Kuma, Mr.3) and [Counter] events to stall " +
      "while the deck mills itself.",
    mainDeck: [
      // 1-drops (8)
      "OP03-044",
      "OP03-044",
      "OP03-044",
      "OP03-044", // Kaya 1/0 +2000, draw 2 trash 2
      "OP01-077",
      "OP01-077",
      "OP01-077",
      "OP01-077", // Perona 1/2000 +1000, deck stacking
      // 2-drops (12)
      "OP01-064",
      "OP01-064",
      "OP01-064",
      "OP01-064", // Alvida 2/3000 +2000, bounce
      "OP01-076",
      "OP01-076",
      "OP01-076",
      "OP01-076", // Bellamy 2/4000 +1000
      "OP03-048",
      "OP03-048", // Nojiko 2/0 +1000, bounce with Nami leader
      // 3-drops (14)
      "OP01-084",
      "OP01-084",
      "OP01-084",
      "OP01-084", // Mr.2.Bon.Kurei 3/4000 +2000, search
      "OP01-079",
      "OP01-079",
      "OP01-079",
      "OP01-079", // Ms. All Sunday 3/1000 [Blocker]
      "OP01-073",
      "OP01-073",
      "OP01-073",
      "OP01-073", // Donquixote Doflamingo 3/4000 [Blocker]
      "OP03-045",
      "OP03-045", // Carne 3/3000 [Blocker]
      // 4-drops (8)
      "OP01-074",
      "OP01-074",
      "OP01-074",
      "OP01-074", // Bartholomew Kuma 4/5000 [Blocker]
      "OP02-065",
      "OP02-065",
      "OP02-065",
      "OP02-065", // Mr.3 4/5000 [Blocker]
      // events (10)
      "OP01-088",
      "OP01-088",
      "OP01-088",
      "OP01-088", // Desert Spada [Counter] +2000
      "OP01-086",
      "OP01-086",
      "OP01-086",
      "OP01-086", // Overheat [Counter] +4000
      "OP02-069",
      "OP02-069", // DEATH WINK [Counter] +6000
    ],
  },

  "green-midrange": {
    leaderId: "OP01-031", // Kouzuki Oden — green, 5 life: trash Wano card to re-stand
    description:
      "Mono-green Land of Wano midrange. Efficient 2-5 cost bodies, rest " +
      "effects (Izo, Nekomamushi, Okiku) that set up K.O.s for Kanjuro and " +
      "X.Drake, plus [Blocker] Killer/Shachi and [Counter] combat tricks.",
    mainDeck: [
      // 1-drops (2)
      "OP01-036",
      "OP01-036", // Otsuru 1/3000 +1000
      // 2-drops (12)
      "OP01-038",
      "OP01-038",
      "OP01-038",
      "OP01-038", // Kanjuro 2/3000 +1000, K.O. rested
      "OP01-048",
      "OP01-048",
      "OP01-048",
      "OP01-048", // Nekomamushi 2/3000 +1000, rest on play
      "OP01-039",
      "OP01-039",
      "OP01-039",
      "OP01-039", // Killer 2/2000 [Blocker]
      // 3-drops (20)
      "OP01-033",
      "OP01-033",
      "OP01-033",
      "OP01-033", // Izo 3/3000 +2000, rest on play
      "OP01-035",
      "OP01-035",
      "OP01-035",
      "OP01-035", // Okiku 3/5000, rest on attack
      "OP01-043",
      "OP01-043",
      "OP01-043",
      "OP01-043", // Shinobu 3/5000 +1000
      "OP01-032",
      "OP01-032",
      "OP01-032",
      "OP01-032", // Ashura Doji 3/4000 +1000
      "OP01-044",
      "OP01-044",
      "OP01-044",
      "OP01-044", // Shachi 3/4000 [Blocker]
      // 4-5 drops (10)
      "OP01-045",
      "OP01-045",
      "OP01-045",
      "OP01-045", // Jean Bart 4/6000 +1000
      "OP01-046",
      "OP01-046",
      "OP01-046",
      "OP01-046", // Denjiro 5/7000, Oden synergy
      "OP01-054",
      "OP01-054", // X.Drake 5/6000, K.O. rested
      // events (6)
      "OP01-057",
      "OP01-057", // Paradise Waterfall [Counter] +2000
      "OP01-058",
      "OP01-058",
      "OP01-058",
      "OP01-058", // Punk Gibson [Counter] +4000
    ],
  },

  "purple-ramp": {
    // King — purple, 5 life. His 10-DON!! -1000 passive is harmless at every
    // stage of the game; other purple leaders actively hurt the heuristic bot
    // (OP05-060 Luffy bleeds a life card per turn, OP11-062 Katakuri's DON!!
    // return cost de-ramps the deck on every attack).
    leaderId: "OP01-091",
    description:
      "Mono-purple DON!! ramp. Real early curve (Law search, Kiwi & Mozu, Zoro) " +
      "plus a blocker wall (Higurashi, Pudding, Eustass Kid) so the deck " +
      "survives to its acceleration: Holedem, Zoro-Juurou, Miss Doublefinger, " +
      "Basil Hawkins and Pudding build toward Charlotte Katakuri and Silvers " +
      "Rayleigh [Rush] ahead of curve.",
    mainDeck: [
      // 1-drops (4)
      "OP09-069",
      "OP09-069", // Trafalgar Law 1/2000 +1000, Straw Hat/Heart search
      "OP06-063",
      "OP06-063", // Vinsmoke Sora 1/0 +2000, trash 1 for DON!! +1
      // 2-drops (12)
      "OP01-100",
      "OP01-100",
      "OP01-100",
      "OP01-100", // Kurozumi Higurashi 2/3000 +1000 [Blocker]
      "OP03-061",
      "OP03-061",
      "OP03-061",
      "OP03-061", // Kiwi & Mozu 2/4000
      "OP01-104",
      "OP01-104",
      "OP01-104",
      "OP01-104", // Speed 2/3000 +1000, [Trigger] play
      // 3-drops (10)
      "OP09-076",
      "OP09-076",
      "OP09-076",
      "OP09-076", // Roronoa Zoro 3/5000, DON!! return for DON!! +1 active
      "OP01-113",
      "OP01-113",
      "OP01-113",
      "OP01-113", // Holedem 3/4000 +1000, [On K.O.] DON!! +1 rested
      "OP05-067",
      "OP05-067", // Zoro-Juurou 3/4000 +1000, [When Attacking] DON!! +1 at <=3 life
      // 4-drops (8)
      "OP05-073",
      "OP05-073", // Miss Doublefinger 4/4000 +2000, trash 1 for DON!! +1, [Trigger]
      "EB03-035",
      "EB03-035",
      "EB03-035",
      "EB03-035", // Charlotte Pudding 4/4000 +2000 [Blocker], DON!! +1 when behind
      "OP01-106",
      "OP01-106", // Basil Hawkins 4/2000 +1000, DON!! +1 rested, [Trigger] play
      // 5-drops (4)
      "OP05-074",
      "OP05-074",
      "OP05-074",
      "OP05-074", // Eustass"Captain"Kid 5/6000 [Blocker], DON!! +1
      // top end (6)
      "OP08-063",
      "OP08-063",
      "OP08-063",
      "OP08-063", // Charlotte Katakuri 6/7000 +1000, DON!! +1
      "OP13-066",
      "OP13-066", // Silvers Rayleigh 8/9000 [Rush]
      // events (6)
      "OP03-072",
      "OP03-072",
      "OP03-072",
      "OP03-072", // Gum-Gum Jet Gatling [Counter] +3000, [Trigger] DON!! +1
      "OP02-091",
      "OP02-091", // Venom Road: [Main] DON!! +1 active, [Trigger] slows opponent
    ],
  },

  "black-removal": {
    leaderId: "OP03-076", // Rob Lucci — black, 5 life: trash 2 to K.O. when opponent plays
    description:
      "Mono-black CP removal. Cost-reduction (Tsuru, Brook, Kalifa, Kuzan, Ice " +
      "Age) feeds K.O. effects (Wanze, Koby, Sakazuki, Lucci leader), with " +
      "[Blocker] Fukurou/Blueno and the [Counter] Six King Pistol for defense.",
    mainDeck: [
      // 1-drops (4)
      "OP02-106",
      "OP02-106",
      "OP02-106",
      "OP02-106", // Tsuru 1/0 +2000, -2 cost on play
      // 2-drops (8)
      "OP03-093",
      "OP03-093",
      "OP03-093",
      "OP03-093", // Wanze 2/4000, K.O. with CP leader
      "OP02-115",
      "OP02-115",
      "OP02-115",
      "OP02-115", // Monkey.D.Garp 2/3000 +2000, K.O. cost 0
      // 3-drops (12)
      "OP03-088",
      "OP03-088",
      "OP03-088",
      "OP03-088", // Fukurou 3/3000 [Blocker]
      "EB01-046",
      "EB01-046",
      "EB01-046",
      "EB01-046", // Brook 3/4000 +1000, -1 cost
      "OP02-098",
      "OP02-098",
      "OP02-098",
      "OP02-098", // Koby 3/4000 +1000, K.O.
      // 4-drops (8)
      "OP03-081",
      "OP03-081",
      "OP03-081",
      "OP03-081", // Kalifa 4/4000 +2000, draw + cost down
      "OP02-096",
      "OP02-096",
      "OP02-096",
      "OP02-096", // Kuzan 4/5000, draw, -4 cost
      // 5-6 drops (10)
      "OP03-080",
      "OP03-080",
      "OP03-080",
      "OP03-080", // Kaku 5/6000 +1000, CP recursion
      "OP03-090",
      "OP03-090",
      "OP03-090",
      "OP03-090", // Blueno 5/6000 [Blocker]
      "OP02-099",
      "OP02-099", // Sakazuki 6/7000, K.O.
      // events (8)
      "OP03-097",
      "OP03-097",
      "OP03-097",
      "OP03-097", // Six King Pistol [Counter]
      "OP02-117",
      "OP02-117",
      "OP02-117",
      "OP02-117", // Ice Age: -5 cost, [Trigger] K.O.
    ],
  },

  "yellow-trigger": {
    leaderId: "OP03-099", // Charlotte Katakuri — yellow, 5 life: life peek + power mod
    description:
      "Mono-yellow Big Mom Pirates trigger deck. Stacks Life with [Trigger] " +
      "cards (Kingbaum, Perospero, Bege, Carmel, Sentomaru, Thunder Bolt), " +
      "manipulates life totals (Sanji, Ikoku Sovereignty) and defends with " +
      "[Blocker] Shirley, Gan.Fall and the Sanji blockers.",
    mainDeck: [
      // 1-drops (2)
      "OP03-115",
      "OP03-115", // Streusen 1/1000 +2000, trigger K.O.
      // 2-drops (12)
      "OP03-102",
      "OP03-102",
      "OP03-102",
      "OP03-102", // Sanji 2/3000 +2000, life-to-hand
      "OP04-113",
      "OP04-113",
      "OP04-113",
      "OP04-113", // Rabiyan 2/3000 +1000, [Trigger] play
      "OP04-101",
      "OP04-101",
      "OP04-101",
      "OP04-101", // Carmel 2/1000 +1000, draw, [Trigger] play + K.O.
      // 3-drops (16)
      "OP03-100",
      "OP03-100",
      "OP03-100",
      "OP03-100", // Kingbaum 3/5000, [Trigger] play
      "OP03-113",
      "OP03-113", // Charlotte Perospero 3/5000, [Trigger]
      "OP04-100",
      "OP04-100",
      "OP04-100",
      "OP04-100", // Capone"Gang"Bege 3/3000 +2000, [Trigger] attack lock
      "OP03-104",
      "OP03-104",
      "OP03-104",
      "OP03-104", // Shirley 3/3000 [Blocker]
      "EB01-054",
      "EB01-054", // Gan.Fall 3/4000 [Blocker]
      // 4-5 drops (12)
      "OP03-108",
      "OP03-108",
      "OP03-108",
      "OP03-108", // Charlotte Cracker 4/5000 +1000, [Trigger]
      "OP12-104",
      "OP12-104",
      "OP12-104",
      "OP12-104", // Sentomaru 4/5000 +1000, [Trigger] K.O. cost 4 or less
      "OP04-104",
      "OP04-104", // Sanji 4/5000 [Blocker], [Trigger]
      "EB02-054",
      "EB02-054", // Sanji 5/6000 [Blocker]
      // events (8)
      "OP03-118",
      "OP03-118",
      "OP03-118",
      "OP03-118", // Ikoku Sovereignty [Counter] +5000, life
      "OP03-121",
      "OP03-121",
      "OP03-121",
      "OP03-121", // Thunder Bolt: [Trigger] K.O.
    ],
  },
};
