import { DataTypes, Optional, ModelDefined, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize";
import { sequelize } from "../helpers/db";
import { Player, LeaderBoard } from "./index"

class LeaderBoardData extends Model<InferAttributes<LeaderBoardData>, InferCreationAttributes<LeaderBoardData>> {
  declare id: CreationOptional<number>;
  declare money: CreationOptional<number>;
  declare playerId: ForeignKey<Player['id']>;
  declare leaderBoardId: ForeignKey<LeaderBoard['id']>;
  
}
LeaderBoardData.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    money: {
        type: DataTypes.INTEGER,
      }
  }, {
  sequelize,
  tableName: "LeaderBoardDatas",
  indexes: [
    {
      name: 'playerId_leaderBoardId_money_index', 
      unique: false, // Tekil olmayan indeks
      fields: ['playerId',"leaderBoardId", 'money'], // İndeksin hangi alanlar üzerinde olacağı
    },
  ],
  timestamps: false,
  
})

export default LeaderBoardData