import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
export interface AdminUserProxy {
  id:number,
  name: string;
  dob: string;
  username: string;
  password: string;
  gender: string;
  email: string;
  address: string;
  contactNumber: string;
  pinCode: string;
  accessRole: string;
  profileImage?: string | null; // Since we're setting it to null, this can be any or null
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) { }

  login(username: string, password: string): Observable<{ token: string; role: string }> {
    const url = `${this.baseUrl}/test/login`;
    const body = { username, password };
    // console.log('jwt:',this.jwt)
    return this.http.post<{ token: string; role: string }>(url, body).pipe(
      catchError(this.handleError)
    );
  }

  getAllUsers(page: number = 0, size: number = 10, sortBy: string = 'id', sortDir: string = 'asc'): Observable<any> {
    const params = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy)
      .set('sortDir', sortDir);

    return this.http.get<any>('http://localhost:8080/test/getAllUsers', { params });
  }

  getUserDetails(email: string): Observable<AdminUserProxy> {
    return this.http.get<AdminUserProxy>(`${this.baseUrl}/test/getUserDetails/${email}`);
  }

  // Method to delete a user by email
  deleteUser(email: string): Observable<any> {
    const params = new HttpParams().set('email', email);
    return this.http.delete(`${this.baseUrl}/test/deleteUser`, { params });
  }

  private handleError(error: HttpErrorResponse) {
    console.error('API Error:', error);
    return throwError(() => new Error('Something went wrong; please try again later.'));
  }
}
