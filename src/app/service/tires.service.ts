import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, Observable} from 'rxjs';
import {API_URL} from "../app.constants";

export enum TaskType {
  blowingTire = 'blowingTire',
  checkingTire = 'checkingTire',
  removingOldTread = 'removingOldTread',
}


export class TaskEntity {
  constructor(
    public id?: bigint,
    public isDone?: boolean,
    public whoDidIt?: string,
    public whenWasItDone?: string,
    public taskType?: TaskType
  ) {}
}
export class TireEntity {
  constructor(
    public id: bigint,
    public tireId: string,
    public lotNumber: string,
    public isTireReady: boolean,
    public isTireScrapped: boolean,
    public tireAdded: string,
    public tasks?: TaskEntity[]
  ) {}
}

@Injectable({
  providedIn: 'root'
})
export class TiresService {

  private tiresSubject = new BehaviorSubject<TireEntity[]>([]);
  public tires$ = this.tiresSubject.asObservable();

  updateTires(tires: TireEntity[]) {
    this.tiresSubject.next(tires);
  }

  public get tiresValue(): TireEntity[] {
    return this.tiresSubject.getValue();
  }

  constructor(private http: HttpClient) {}

  getTires(): Observable<TireEntity[]> {
    return this.http.get<TireEntity[]>(`${API_URL}/api/tires`);
  }

  updateTire(id: bigint, tire: TireEntity): Observable<TireEntity> {
    return this.http.put<TireEntity>(`${API_URL}/api/tires/${id}`, tire);
  }

  fetchAndUpdateTires() {
    this.getTires().subscribe(data => {
      this.updateTires(data);
    });
  }

  getTiresByDate(date: string): Observable<TireEntity[]> {
    return this.http.get<TireEntity[]>(`${API_URL}/api/tires/${date}`);
  }


  addTire() {
    return this.http.get<TireEntity>(`${API_URL}/api/tires/new-tire`);
  }
}
