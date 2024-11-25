import Sequlize from "sequelize";
import redisClient from "../helpers/redisClient"
import { LeaderBoard, LeaderBoardData, Player } from "../models"
import { sequelize } from "./db";

export async function resetLatestLeaderBoardAndPrepareNewLeaderBoard() {
  

  let latestLeaderBoard = await LeaderBoard.findOne({
    order: [['createdAt', 'DESC']]

  })
  const now = new Date();

  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7); 



  if (!latestLeaderBoard) {

    throw new Error("Please create a leader Board")
  }

  // Büyüktür kalcak
  else if ( 
     latestLeaderBoard.createdAt > oneWeekAgo.getTime()) {
      console.log("It is too early for resetting board")
      setTimeout(resetLatestLeaderBoardAndPrepareNewLeaderBoard, latestLeaderBoard.createdAt- oneWeekAgo.getTime() )
      return;
  }

    const latestLeaderBoardId = latestLeaderBoard.id

    const totalMoney: number = await LeaderBoardData.sum('money', {
      where: {
        leaderBoardId: latestLeaderBoardId
      }
    });

    const firstPlayerMoney = Math.floor(totalMoney * 20 / 100)
    const secondPlayerMoney = Math.floor(totalMoney * 15 / 100)
    const thirdPlayerMoney = Math.floor(totalMoney * 10 / 100)

    const remainderMoneyPerPerson = Math.floor(totalMoney * 55 / 100 / 97)


    // First 100
    const first100WithScores = await redisClient.zRangeWithScores("leaderBoard/" + latestLeaderBoardId, 0, 99, { REV: true })



    // Assume that at a least 100 players

    const firstUpdatedPlayer = await Player.update(
      {
        collectedMoney: sequelize.literal('"collectedMoney" + ' + firstPlayerMoney)
      },
      {
        where: {
          id: first100WithScores[0].value
        },
      }
    );
    const secondUpdatedPlayer = await Player.update(
      {
        collectedMoney: sequelize.literal('"collectedMoney" + ' + secondPlayerMoney)
      },
      {
        where: {
          id: first100WithScores[1].value
        },
      }
    );
    const thirdUpdatedPlayer = await Player.update(
      {
        collectedMoney: sequelize.literal('"collectedMoney" + ' + thirdPlayerMoney)
      },
      {
        where: {
          id: first100WithScores[2].value
        },
      }
    );

    const remainingUpdatedPlayers = await Player.update(
      {
        collectedMoney: sequelize.literal('"collectedMoney" + ' + remainderMoneyPerPerson)
      },
      {
        where: {
          id: first100WithScores.slice(3, 100).map(value => value.value)
        },
      }
    );


    const newLeaderBoard = await LeaderBoard.create({})
    const query = `
  INSERT INTO "LeaderBoardDatas" ("playerId", "leaderBoardId","money")
  SELECT "id", :leaderBoardId, :money
  FROM "Players"
`;
    const result = await sequelize.query(query, {
      replacements: { leaderBoardId: newLeaderBoard.id, money: 0 },
      type: Sequlize.QueryTypes.INSERT,
      
    });

    await redisClient.set("latestLeaderBoardId",String(newLeaderBoard.id))
    

    console.log("LeaderBoard Resetted")
    
    const oneWeekInMillis = 7 * 24 * 60 * 60 * 1000;
    setTimeout(resetLatestLeaderBoardAndPrepareNewLeaderBoard,oneWeekInMillis)

  }
