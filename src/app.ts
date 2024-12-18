import 'dotenv/config'
import express from "express";
import { errorHandlerMiddleware } from "./middlewares/errorHandlerMiddleware";
import { sequelizeCheck } from "./helpers/db";
import { connectRedisServer } from './helpers/redisClient';
import { Request, Response, NextFunction } from "express";
import { addSomeDataForTest, deneme, resetDB } from './models';
import leaderBoardRouter from "./routers/leaderBoard"
import { resetLatestLeaderBoardAndPrepareNewLeaderBoard } from './helpers/leaderBoardOperations';

const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
const PORT = 3000



//Connect DB
sequelizeCheck().then(async () => {
});

// Connect Redis Server
connectRedisServer();

// Start Server
app.listen(PORT, () => {
    console.log('Server is running on http://localhost:' + PORT);
});

// İzin verilen kaynakların listesi
const allowedOrigins = ['http://localhost:3001', 'https://panteon-task-frontend.onrender.com'];

const corsOptions = {
  origin: function (origin:any, callback:any) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true); // Kaynak izin verilen listede ise, erişime izin ver
    } else {
      callback(new Error('Not allowed by CORS'), false); // Aksi takdirde erişimi reddet
    }
  }
};

// CORS middleware kullan
app.use(cors(corsOptions));


// Middleware For Handling Errors
app.use(errorHandlerMiddleware)


app.get("/", async (req: Request, res: Response, next: NextFunction) => {
    res.send("Hello world")
    return
})

app.use("/leaderBoard", leaderBoardRouter);




setTimeout(resetLatestLeaderBoardAndPrepareNewLeaderBoard, 15 * 1000);






