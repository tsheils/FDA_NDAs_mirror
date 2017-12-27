import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Subject} from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { catchError, map, tap } from 'rxjs/operators';
import {Drug} from '../models/drug';

@Injectable()
export class DataLoaderService {

  private _dataSource = new Subject<any>();
  //  Observable navItem stream
  data$ = this._dataSource.asObservable();
  dataMap: Map<number, any[]> = new Map();

  constructor(private http: HttpClient) {}

  getData(url: string): Observable<any> {
    return this.http.get(url, {responseType: 'text'})
      .pipe(
        map(response => this.csvJSON(response.trim())),
        catchError(this.handleError('getData', []))
      );
  }


  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  private csvJSON(csv): void {
    const lines: string[] = csv.split(/\r\n|\n/);
    const result: any[] = [];

    const headers = lines.shift().split(',');
    for (const i of lines) {
      const obj: Drug = new Drug();
      const currentline = i.split(/,(?=(?:(?:[^"]*"){2})*[^"]*$)/);

      for (const j in headers) {
        obj[headers[j]] = currentline[j].replace('"','').replace('"','');
      }
      const d = obj.dateString.split('/');
      obj.date = Date.parse(d[0] + '/' + d[1]);
      obj.moleculeType = obj.moleculeType.toLowerCase();
      obj.fullDate = Date.parse(obj.dateString);
      obj.year =  Number(obj.dateString.split('/')[2]);
      obj.developmentTime = this.getDevTime(obj);

      let yearList: any[] = this.dataMap.get(obj.year);
     if (yearList && yearList.length > 0) {
       yearList.push(obj);
     }else {
       yearList = [obj];
     }
        this.dataMap.set(obj.year, yearList);
   //  result.push(obj);
    }
    this._dataSource.next(this.dataMap);
  }

  getDevTime(drug: Drug): number {
    let start: Date;
    if (drug.initClinicalStudy) {
      start = new Date('1/1/'.concat(drug.initClinicalStudy.toString()));
    }else {
      start = new Date(drug.nctDate.split('/')[2]);
    }
    const end: Date =  new Date(drug.fullDate);
    const d1Y = start.getFullYear();
    const d2Y = end.getFullYear();
    const d1M = start.getMonth();
    const d2M = end.getMonth();
    return Number((((d2M + 12 * d2Y) - (d1M + 12 * d1Y)) / 12).toFixed(2));
  }
}

