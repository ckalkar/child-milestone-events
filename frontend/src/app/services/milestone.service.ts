import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import {
  Milestone,
  CreateMilestoneDto,
  UpdateMilestoneDto,
  MilestoneStats,
} from '../models/milestone.model';

export interface MilestoneFilters {
  categoryId?: number;
  isMajor?: boolean;
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MilestoneService {
  private apiUrl = `${environment.apiUrl}/milestones`;

  constructor(private http: HttpClient) {}

  getAll(filters?: MilestoneFilters): Observable<Milestone[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.categoryId !== undefined) {
        params = params.set('categoryId', filters.categoryId.toString());
      }
      if (filters.isMajor !== undefined) {
        params = params.set('isMajor', filters.isMajor.toString());
      }
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
    }

    return this.http.get<Milestone[]>(this.apiUrl, { params });
  }

  getById(id: number): Observable<Milestone> {
    return this.http.get<Milestone>(`${this.apiUrl}/${id}`);
  }

  create(milestone: CreateMilestoneDto): Observable<Milestone> {
    return this.http.post<Milestone>(this.apiUrl, milestone);
  }

  update(id: number, milestone: UpdateMilestoneDto): Observable<Milestone> {
    return this.http.patch<Milestone>(`${this.apiUrl}/${id}`, milestone);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getTimeline(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/timeline`);
  }

  getStats(): Observable<MilestoneStats> {
    return this.http.get<MilestoneStats>(`${this.apiUrl}/stats`);
  }
}

