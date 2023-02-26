import { HttpException } from '@nestjs/common/exceptions/http.exception';
import { NestInterceptor, CallHandler, Injectable, ExecutionContext } from '@nestjs/common';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Request, Response, NextFunction } from 'express';
import * as jwt from 'jsonwebtoken';
// import { SECRET } from '../config';
// import { UserService } from './user.service';
import { Observable } from 'rxjs';
import { window } from 'rxjs/operators';

@Injectable()
export class AuthInterceptor implements NestInterceptor {
  // constructor(private httpService: HttpService) {}

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {

    //console.log(process.env.AUTH_TOKEN, 'geet tooken')

    const ctx = context.switchToHttp();
    const token = ctx.getRequest().headers['authorization'];
    // ctx.getRequest().
    // console.log(token, 'geet tooken')
    //if (ctx?.token) {

      // this.httpService.axiosRef.defaults.headers.common['authorization'] =
      //   token;
    //}
    return next.handle().pipe();
  }
}
