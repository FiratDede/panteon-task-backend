import  {Request, Response, NextFunction} from "express";
import { CustomError } from "../helpers/errorHelpers"

export const errorHandlerMiddleware = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.log("Error middleware")
    console.error(err.stack)
    res.status(err.statusCode).send(err.message)
  }