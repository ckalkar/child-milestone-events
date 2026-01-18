import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environment';
import { Media, CreateMediaDto, UpdateMediaDto } from '../models/media.model';

export interface MediaFilters {
  milestoneId?: number | null;
  fileType?: 'image' | 'video';
  startDate?: string;
  endDate?: string;
}

@Injectable({
  providedIn: 'root',
})
export class MediaService {
  private apiUrl = `${environment.apiUrl}/media`;
  public uploadsUrl = `${environment.uploadUrl}`;

  constructor(private http: HttpClient) {}

  upload(file: File, metadata: CreateMediaDto): Observable<Media> {
    const formData = new FormData();
    formData.append('file', file);

    if (metadata.caption) {
      formData.append('caption', metadata.caption);
    }
    if (metadata.takenDate) {
      formData.append('takenDate', metadata.takenDate);
    }
    if (metadata.milestoneId !== undefined) {
      formData.append('milestoneId', metadata.milestoneId.toString());
    }

    return this.http.post<Media>(`${this.apiUrl}/upload`, formData);
  }

  getAll(filters?: MediaFilters): Observable<Media[]> {
    let params = new HttpParams();

    if (filters) {
      if (filters.milestoneId !== undefined) {
        params = params.set('milestoneId', filters.milestoneId?.toString() || '');
      }
      if (filters.fileType) {
        params = params.set('fileType', filters.fileType);
      }
      if (filters.startDate) {
        params = params.set('startDate', filters.startDate);
      }
      if (filters.endDate) {
        params = params.set('endDate', filters.endDate);
      }
    }

    return this.http.get<Media[]>(this.apiUrl, { params });
  }

  getGallery(fileType?: 'image' | 'video'): Observable<Media[]> {
    let params = new HttpParams();
    if (fileType) {
      params = params.set('fileType', fileType);
    }
    return this.http.get<Media[]>(`${this.apiUrl}/gallery`, { params });
  }

  getById(id: number): Observable<Media> {
    return this.http.get<Media>(`${this.apiUrl}/${id}`);
  }

  update(id: number, media: UpdateMediaDto): Observable<Media> {
    return this.http.patch<Media>(`${this.apiUrl}/${id}`, media);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getMediaUrl(media: Media): string {
    return `${this.uploadsUrl}/${media.filePath}`;
  }

  getThumbnailUrl(media: Media): string {
    if (media.thumbnailPath) {
      return `${this.uploadsUrl}/${media.thumbnailPath}`;
    }
    return this.getMediaUrl(media);
  }
}

