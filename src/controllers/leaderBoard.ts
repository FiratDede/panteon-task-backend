import { Request, Response, NextFunction } from "express";
import { LeaderBoardData, Player } from "../models"
import redisClient from "../helpers/redisClient"


export async function getRankOfPlayerWithTopRankingsLatest(req: Request, res: Response, next: NextFunction) {

    const latestLeaderBoardId: string | null = await redisClient.get("latestLeaderBoardId")

    const { name } = req.body

    const searchedPlayer = await Player.findOne({
        where: {
            name: name
        }
    })

    if (!searchedPlayer) {
        res.send("Player Not Found")
        return
    }

    const searchedPlayerIdStringForm = String(searchedPlayer.id)


    let rankOfPlayer: number | null = await redisClient.zRevRank("leaderBoard/" + latestLeaderBoardId, searchedPlayerIdStringForm)

    const numberOfPlayers: number = await redisClient.zCard("leaderBoard/" + latestLeaderBoardId)


    let first100Ids: string[] = []
    let otherIds: string[] = []


    if (rankOfPlayer) {
        first100Ids = await redisClient.zRange("leaderBoard/" + latestLeaderBoardId, 0, 99, { REV: true, })


        if (rankOfPlayer > 97 && rankOfPlayer < 103) {
            // 100 den başla sonra min (100 ,rankofPlayer+2)
            otherIds = await redisClient.zRange("leaderBoard/" + latestLeaderBoardId, 100, Math.min(100, rankOfPlayer + 2), { REV: true })
        }
        else {
            otherIds = await redisClient.zRange("leaderBoard/" + latestLeaderBoardId, (rankOfPlayer - 3), Math.min(numberOfPlayers - 1, rankOfPlayer + 2), { REV: true })

        }
    }
    const mergedForm = [...first100Ids, ...otherIds]

    const answer = await LeaderBoardData.findAll(
        {
            attributes: ["money"],
            where: { playerId: mergedForm, leaderBoardId: String(latestLeaderBoardId) },
            order: [["money", "DESC"]],
            include: [
                {
                    model: Player,
                    attributes: [
                        ['id','playerId'],
                        'name',
                        'country',
                    ]
                },
            ],
            raw: true
        })

      let  answerWithRanks: any = []
   
         answerWithRanks = answer.map((val, index) => {
        if (index <= 99) {

            return { ...val, rank: index + 1 }
        }
        else {
            if (rankOfPlayer !== null)

                return { ...val, rank: index - 99 + rankOfPlayer }
            else {
                return {}
            }
        }

    })
        

    // console.log(answerWithRanks)

    res.status(200).json(answerWithRanks)
    return
}


