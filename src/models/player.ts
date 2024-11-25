import { DataTypes, Optional, ModelDefined, Model, InferAttributes, InferCreationAttributes, CreationOptional, ForeignKey } from "sequelize";
import { sequelize } from "../helpers/db";


class Player extends Model<InferAttributes<Player>, InferCreationAttributes<Player>> {
  declare id: CreationOptional<number>;
  declare name: string;
  declare country: string;
  declare collectedMoney: CreationOptional<number>;
}
Player.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
    country: {
      type: DataTypes.STRING,
    },
    collectedMoney: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    }
    
   
  }, {
  sequelize,
  tableName: "Players"
})

export default Player