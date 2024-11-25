import { DataTypes, Optional, ModelDefined, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize";
import { sequelize } from "../helpers/db";


class LeaderBoard extends Model<InferAttributes<LeaderBoard>, InferCreationAttributes<LeaderBoard>> {
  declare id: CreationOptional<number>;
  declare createdAt:  CreationOptional<number>;

}
LeaderBoard.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    createdAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
      }
   
  }, {
  sequelize,
  tableName: "LeaderBoards",
  timestamps: false,
})

export default LeaderBoard