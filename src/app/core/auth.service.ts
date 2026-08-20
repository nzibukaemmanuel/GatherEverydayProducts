import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: AuthUser;
}

const STORAGE_KEY = 'gather-auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly userSubject = new BehaviorSubject<AuthUser | null>(this.readStoredUser());
  readonly currentUser$ = this.userSubject.asObservable();

  constructor(private readonly http: HttpClient) {}

  get token(): string | null {
    return this.readStored()?.token ?? null;
  }

  signup(name: string, email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/signup`, { name, email, password })
      .pipe(tap((response) => this.persist(response)));
  }

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http
      .post<AuthResponse>(`${environment.apiUrl}/auth/login`, { email, password })
      .pipe(tap((response) => this.persist(response)));
  }

  logout(): void {
    localStorage.removeItem(STORAGE_KEY);
    this.userSubject.next(null);
  }

  private persist(response: AuthResponse): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(response));
    this.userSubject.next(response.user);
  }

  private readStored(): AuthResponse | null {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as AuthResponse;
    } catch {
      return null;
    }
  }

  private readStoredUser(): AuthUser | null {
    return this.readStored()?.user ?? null;
  }
}
