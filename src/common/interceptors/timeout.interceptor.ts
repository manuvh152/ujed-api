import { CallHandler, ExecutionContext, GatewayTimeoutException, Injectable, NestInterceptor, RequestTimeoutException } from "@nestjs/common";
import { Observable, TimeoutError, catchError, throwError, timeout } from "rxjs";


@Injectable()
export class TimeoutInterceptor implements NestInterceptor{
  constructor(
    private readonly timeoutInMilis: number
  ){}

  intercept(context: ExecutionContext, next: CallHandler<any>): Observable<any> | Promise<Observable<any>> {
    return next.handle().pipe(
      timeout({ each: 600000 }),
      catchError(err => {
        if(err instanceof TimeoutError){
          throw new GatewayTimeoutException('Gateway timeout has ocurred');
        }
        return throwError(() => err);
      })
    )
  }
}