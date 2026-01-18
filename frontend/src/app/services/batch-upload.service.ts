import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import {
  BatchUploadRequest,
  BatchUploadResponse,
  BatchValidationResponse,
} from '../models/batch-upload.model';

@Injectable({
  providedIn: 'root',
})
export class BatchUploadService {
  private readonly apiUrl = `${environment.apiUrl}/batch`;

  constructor(private http: HttpClient) {}

  getBatchTemplate(): Observable<any> {
    return this.http
      .get(`${this.apiUrl}/template`)
      .pipe(catchError(this.handleError));
  }

  validateBatch(
    files: File[],
    batchData: BatchUploadRequest,
  ): Observable<BatchValidationResponse> {
    const formData = new FormData();
    
    // Append all files
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // Append batch data as JSON
    formData.append('batchData', JSON.stringify(batchData));

    return this.http
      .post<BatchValidationResponse>(
        `${this.apiUrl}/validate`,
        formData,
      )
      .pipe(catchError(this.handleError));
  }

  uploadBatch(
    files: File[],
    batchData: BatchUploadRequest,
  ): Observable<BatchUploadResponse> {
    const formData = new FormData();
    
    // Append all files
    files.forEach((file) => {
      formData.append('files', file);
    });
    
    // Append batch data as JSON
    formData.append('batchData', JSON.stringify(batchData));

    return this.http
      .post<BatchUploadResponse>(
        `${this.apiUrl}/upload`,
        formData,
      )
      .pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred during batch upload';
    
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error?.message) {
        errorMessage = error.error.message;
      } else if (error.error?.errors) {
        errorMessage = Array.isArray(error.error.errors)
          ? error.error.errors.join(', ')
          : error.error.errors;
      } else {
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
      }
    }
    
    return throwError(() => new Error(errorMessage));
  }
}
