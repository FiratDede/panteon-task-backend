import { sequelize, syncDB } from "../helpers/db";
import Player from "./player";
import LeaderBoard from "./leaderBoard";
import LeaderBoardData from "./leaderBoardData";
import redisClient from "../helpers/redisClient";


Player.hasMany(LeaderBoardData, {foreignKey: "playerId"});
LeaderBoardData.belongsTo(Player, {foreignKey: "playerId"});

LeaderBoard.hasMany(LeaderBoardData, {foreignKey: "leaderBoardId", });
LeaderBoardData.belongsTo(LeaderBoard, {foreignKey: "leaderBoardId"});


syncDB();



export const addSomeDataForTest = async (playerCount: number) => {
  try {
    console.log("Adding Some Data For Test")
    // Check DB Connection
    await sequelize.authenticate();

    // Sync DB
    await sequelize.sync({ force: true }); // Create tables from scratch
    console.log('Db syncronized!');

    const newLeaderBoard = await LeaderBoard.create({})

    await redisClient.set("latestLeaderBoardId",String(newLeaderBoard.id))


    for (let i = 0; i < playerCount; ++i) {
      let player = await Player.create({ name: "Player" + i, country: "Turkey", })

      let moneyVal =  Math.floor(Math.random() * 100000) + 1

      await LeaderBoardData.create({
        playerId: player.id,
        leaderBoardId: newLeaderBoard.id,
        money: moneyVal
      })
      await redisClient.zAdd("leaderBoard/"+newLeaderBoard.id, [{ value: String(player.id), score: moneyVal }])



    }
    console.log(`${playerCount} players added!`)
    console.log(`${playerCount} leader board data added!`)

  } catch (error) {
    console.error('Error:', error);
  }

}


export const resetDB = async () => {
  try {
    // Check DB Connection
    await sequelize.authenticate();
    // Sync DB
    await sequelize.sync({ force: true }); // Create tables from scratch
    console.log('Db syncronized and resetted!');
    }
  catch (error) {
    console.error('Error:', error);
  }
}

export const deneme = async ( )=>{

  let latestLeaderBoard = await LeaderBoard.findOne({
    order: [['createdAt', 'DESC']]
  })
  
  const now = new Date();

  // Bir hafta önceki tarihi hesapla
  const oneWeekAgo = new Date(now);
  oneWeekAgo.setDate(now.getDate() - 7); // 7 gün çıkar

  if(latestLeaderBoard === null)

    throw Error("elma")
    console.log(Number(latestLeaderBoard.createdAt))
  console.log(latestLeaderBoard.createdAt < oneWeekAgo.getTime())

  return latestLeaderBoard;
}



export {
  Player,
  LeaderBoard,
  LeaderBoardData
};