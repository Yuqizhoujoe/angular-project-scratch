import {Injectable} from '@angular/core';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {catchError, tap} from 'rxjs/operators';
import {Subject, throwError} from 'rxjs';
import {User} from './user.model';

export interface AuthResponseData {
    idToken: string;
    email: string;
    refreshToken: string;
    expiresIn: string;
    localId: string;
    registered?: boolean
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    user = new Subject<User>();

    constructor(private http: HttpClient) {
    }

    signup(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyC8VOumIIZpiHdP44Nt8HMQ76jXzUsU_ew',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(catchError(this.handleError))
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(
            'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyC8VOumIIZpiHdP44Nt8HMQ76jXzUsU_ew',
            {
                email: email,
                password: password,
                returnSecureToken: true
            }
        ).pipe(
            catchError(this.handleError),
            tap(res => {
                this.handleAuthentication(res.email, res.localId, res.idToken, Number(res.expiresIn));
            })
        );
    }

    private handleAuthentication(email: string, userId: string, token:string, expiresIn: number) {
        const expirationDate = new Date(new Date().getTime() + Number(expiresIn) * 1000);
        const user = new User(email, userId, token, expirationDate);
        this.user.next(user);
    }

    private handleError(errorResponse: HttpErrorResponse) {
        let msg = 'An unknown error occurred';
        if (!errorResponse.error || !errorResponse.error.error) {
            return throwError(msg);
        }
        switch (errorResponse.error.error.message) {
            case 'EMAIL_EXISTS':
                msg = 'This email exists already';
                break;
            case 'EMAIL_NOT_FOUND':
                msg = 'This email does not exists!';
                break;
            case 'INVALID_PASSWORD':
                msg = 'This password is not valid!';
                break;
            case 'USER_DISABLED':
                msg = 'Please contact agent. Your account is disabled!';
                break;
        }
        return throwError(msg);
    }
}
