import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { map } from 'rxjs/operators';
// import { catchError, retry } from "rxjs/operator";
import { Account } from "../models/account";

@Injectable({
  providedIn: 'root'
})

export class AuthenticationHandler {
  // Mô tả url 
  private urlForSignin = 'http://192.168.0.101:8000/api/signin'

  private currentUserSubject: BehaviorSubject<Account>;
  public currentUser: Observable<Account>;

  constructor(private http: HttpClient) {
    this.currentUserSubject = new BehaviorSubject<Account>(JSON.parse(localStorage.getItem('currentUser')));
    this.currentUser = this.currentUserSubject.asObservable();
  }

  signin(user_name: string, password: string): Observable<Account> {
    const formData = new FormData();
    formData.append('user_name', user_name);
    formData.append('password', password);

    return this.http.post<Account>(this.urlForSignin, formData).pipe(map(obj => {
      console.log('Thông tin phản hồi là: ', obj)
      if (obj) {
        if (obj["result"] == true) {
          var acc = new Account()
          acc.account_id = obj['data'].account_id
          acc.first_name = obj['data'].first_name
          acc.last_name = obj['data'].last_name
          acc.user_name = obj['data'].user_name

          localStorage.setItem('currentUser', JSON.stringify(acc));
          this.currentUserSubject.next(acc);
          return acc
        } else {
          alert(obj['error'])
        }

        return new Account();
      }

      return new Account();
    }))
  }

  logout() {
    // remove user from local storage to log user out
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }

  

}
