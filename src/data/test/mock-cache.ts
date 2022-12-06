import { LoadPurchases } from './../../domain/usecases/load-purcheses';

import { SavePurchases } from "@/domain/usecases/save-purcheses";
import { CacheStore } from "../protocols/cache/cache-store";

 const maxageInDays = 3;
export const getCacheExpirationDate = (timestamp:Date): Date => {
  const maxCacheaAge = new Date(timestamp);
  maxCacheaAge.setDate(maxCacheaAge.getDate() - maxageInDays);

  return maxCacheaAge;
}


export class CacheStoreSpy implements CacheStore {
    message: Array<CacheStoreSpy.Message> = []
    deleteKey: string;
    insertKey: string;
    fetchKey: string;
    fetchResult: any;
    insertValues: Array<SavePurchases.Params> = [];

fetch(key: string): any {
      this.fetchKey = key;
      this.message.push(CacheStoreSpy.Message.fetch);
      return this.fetchResult;
    }
  
    delete(key: string): void {
      this.message.push(CacheStoreSpy.Message.delete);
    
      this.deleteKey = key;
    }
    insert(key: string, value: any): void {
      this.message.push(CacheStoreSpy.Message.insert);
     
      this.insertKey = key;
      this.insertValues = value;
    }
    simulateDeleteError(): void {
      jest.spyOn(CacheStoreSpy.prototype, "delete").mockImplementationOnce(() => {
        this.message.push(CacheStoreSpy.Message.delete);
        throw new Error();
      });
    }
    simulateInsertError(): void {
      jest.spyOn(CacheStoreSpy.prototype, "insert").mockImplementationOnce(() => {
        this.message.push(CacheStoreSpy.Message.insert);
        throw new Error();
      });
    }
    simulateFetchError(): void {
      jest.spyOn(CacheStoreSpy.prototype, "fetch").mockImplementationOnce(() => {
        this.message.push(CacheStoreSpy.Message.fetch);
        throw new Error();
      });
    
  }
}
   export namespace CacheStoreSpy {
    export enum Message {
        delete,
        insert,
        fetch,
  }
    }
   