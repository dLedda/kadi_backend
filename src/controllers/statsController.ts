import DbUser, { IDbUser } from "../models/dbUser";
import { RequestHandler } from "express";
import Player, { IPlayer } from "../models/player";

const DEFAULT_RULESET = "DEFAULT_RULESET";

export interface GameSubmission {
  ruleset: string;
  players: { id: string; nick: string }[];
  results: GameResults[];
}

interface GameResults {
  playerId: string;
  blocks: Record<BlockName, Block>;
}

type BlockName = "top" | "bottom";

interface Block {
  cells: Record<CellName, StandardCell>;
}

type CellName =
  | "aces"
  | "twos"
  | "threes"
  | "fours"
  | "fives"
  | "sixes"
  | "three_kind"
  | "four_kind"
  | "full_house"
  | "sml_straight"
  | "lg_straight"
  | "yahtzee"
  | "chance";

interface StandardCell {
  value: CellValue;
}

type CellValue = number | boolean | "cellFlagStrike";

export const listGames: RequestHandler = async (req, res) => {
  const user = req.user as IDbUser;
  const dbUser = await DbUser.findById(user.id, {
    "savedGames._id": 1,
    "savedGames.results": 1,
    "savedGames.createdAt": 1,
  });
  if (dbUser) {
    res.json({ games: dbUser.savedGames });
  } else {
    res.sendStatus(404);
  }
};

export const saveGame: RequestHandler = async (req, res) => {
  const user = req.user as IDbUser;
  const submission = req.body as GameSubmission;
  await addNewGuestsFromSubmissionAndFillInIds(submission, user);
  const newGame = await user.addGame(submission);
  if (submission.ruleset === DEFAULT_RULESET) {
    processStandardStatistics(submission.results, user);
  }
  console.log(JSON.stringify(req.body));
  res.send({ message: "Game submitted successfully!", newGame: newGame });
};

async function addNewGuestsFromSubmissionAndFillInIds(
  submission: GameSubmission,
  user: IDbUser
): Promise<void> {
  for (const playerInParticipantList of submission.players) {
    if (playerInParticipantList.id === playerInParticipantList.nick) {
      const newGuest = await user.addGuest(playerInParticipantList.nick);
      const gameResultsFromNewGuest = submission.results.find(
        (result) => result.playerId === playerInParticipantList.nick
      );
      gameResultsFromNewGuest!.playerId = newGuest.id;
      playerInParticipantList.id = newGuest.id;
    }
  }
}

function processStandardStatistics(results: GameResults[], account: IDbUser) {
  let runnerUp: IPlayer;
  const drawnPlayers: IPlayer[] = [];
  const scoredResults: { pid: string; score: number }[] = [];
  for (const result of results) {
      Player.updatePlayerStats(result.playerId, result);
      scoredResults.push({pid: result.playerId, score: calculateStandardScore(result)});
  }
  const winner = Math.max(...scoredResults.map(result => result.score));
  //winner.incrementWin();
  //runnerUp.incrementRunnerUp();
  //drawnPlayers.forEach(player => player.incrementDraw();
}

function calculateStandardScore(result: GameResults): number {
  const top = result.blocks.top.cells;
  const bottom = result.blocks.bottom.cells;
  return (
    cellScore(top.aces) +
    cellScore(top.twos) * 2 +
    cellScore(top.threes) * 3 +
    cellScore(top.fours) * 4 +
    cellScore(top.fives) * 5 +
    cellScore(top.sixes) * 6 +
    cellScore(bottom.three_kind) +
    cellScore(bottom.four_kind) +
    cellScore(bottom.full_house) * 25 +
    cellScore(bottom.sml_straight) * 30 +
    cellScore(bottom.lg_straight) * 40 +
    cellScore(bottom.yahtzee) * 50 +
    cellScore(bottom.chance)
  );
}

function cellScore(cell: StandardCell) {
  if (cell.value === "cellFlagStrike" || cell.value === false) {
    return 0;
  } else if (cell.value === true) {
    return 1;
  }
  return cell.value;
}

const example = {
  players: [
    {
      id: "5ecbf33a9d246114c0c9d9bb",
      nick: "Ledda",
    },
  ],
  results: [
    {
      playerId: "5ecbf33a9d246114c0c9d9bb",
      blocks: [
        {
          id: "top",
          cells: [
            { id: "aces", value: 1 },
            { id: "twos", value: 1 },
            { id: "threes", value: 1 },
            { id: "fours", value: 1 },
            { id: "fives", value: 1 },
            { id: "sixes", value: 1 },
          ],
        },
        {
          id: "bottom",
          cells: [
            { id: "three_kind", value: "cellFlagStrike" },
            { id: "four_kind", value: "cellFlagStrike" },
            { id: "full_house", value: true },
            { id: "sml_straight", value: true },
            { id: "lg_straight", value: true },
            { id: "yahtzee", value: 1 },
            { id: "chance", value: "cellFlagStrike" },
          ],
        },
      ],
    },
  ],
};
