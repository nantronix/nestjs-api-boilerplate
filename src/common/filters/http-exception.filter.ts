import {
	ArgumentsHost,
	Catch,
	ExceptionFilter,
	HttpException
} from '@nestjs/common'
import { Request, Response } from 'express';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter<HttpException> {
	catch(exception: HttpException, host: ArgumentsHost) {
		const ctx = host.switchToHttp()
		const response = ctx.getResponse()
		const request = ctx.getRequest()
		const statusCode = exception.getStatus()

		/*response.status(statusCode).json({
			statusCode,
			message: exception.message.message || exception.message.error,
			timestamp: new Date().toISOString(),
			path: request.url
		})*/
    response
      .status(statusCode)
      .json({
        statusCode: statusCode,
        timestamp: new Date().toISOString(),
        path: request.url,
        errmsg:exception.message,
        error:1,
      });
	}
}
