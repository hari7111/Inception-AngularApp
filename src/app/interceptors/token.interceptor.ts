import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, catchError, switchMap, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { TokenApiModel } from '../models/token-api.model';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private auth : AuthService,private router : Router) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const myToken = this.auth.getToken();

    if (myToken) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${myToken}`
        }
      });
    }
    return next.handle(request).pipe(
      catchError((err:any)=>{
        if(err instanceof HttpErrorResponse){
          if(err.status === 401){
           return this.handleUnAuthorizedError(request,next);
          }
        }
        return throwError(()=> new Error("Some other error occured!"));
      })
    );
  }

  handleUnAuthorizedError(req:HttpRequest<any>, next :HttpHandler){
    let tokeApiModel = new TokenApiModel();
    tokeApiModel.accessToken = this.auth.getToken() as string;
    tokeApiModel.refreshToken = this.auth.getRefershToken() as string;


    return this.auth.renweToken(tokeApiModel)
    .pipe(
      switchMap((data:TokenApiModel)=>{
        this.auth.storeRefreshToken(data.refreshToken);
        this.auth.storeToken(data.accessToken);
          
        req = req.clone({
          setHeaders: {
            Authorization: `Bearer ${data.accessToken}`
          }
        });
    
        return next.handle(req);
      }),
      catchError((err=>{
        return throwError(()=>{
          alert("Token is Expire");
          this.router.navigate(['login']);
        })
      }))
    )

  }
}
