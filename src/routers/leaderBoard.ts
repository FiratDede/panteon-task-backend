import {Router} from "express";
import { catchErrorWrapper } from "../helpers/errorHelpers";
import { getRankOfPlayerWithTopRankingsLatest } from "../controllers/leaderBoard";

var router: Router = Router();

router.post("/latest/list",getRankOfPlayerWithTopRankingsLatest)



export default router