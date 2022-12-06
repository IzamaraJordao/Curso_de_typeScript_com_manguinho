import { PurchasesModel } from './../models/purchases-model';

export interface LoadPurchases {
  loadAll: () => Promise<Array<LoadPurchases.Result>;
}
export namespace LoadPurchases {
  export type Result = PurchasesModel;
}
 
