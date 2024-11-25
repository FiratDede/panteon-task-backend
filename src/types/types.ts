export type GenericObject = {
    [key: string]: any;  // Index signature to allow dynamic keys
};
export type Db = {
    dbName: string;
    dbUsername: string;
    dbPassword: string;
    dbHost: string;
    dbPort: number;
};

export type BuyOrSellRequestBody = {
    quantity: number;
    shareId: number; 
    portfolioId: number;
  }