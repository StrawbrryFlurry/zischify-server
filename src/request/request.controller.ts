import { Controller, Get, Post, Delete, Body, Req } from '@nestjs/common';
import { RequestService } from './request.service';
import { IZischRequest } from 'src/models/request/ZischRequest.model';
import { TAuthenticatedUserRequest } from 'src/middleware/token-verification.middleware';
import { request } from 'http';

@Controller('request')
export class RequestController {
  constructor(private readonly requestService: RequestService) {}

  @Get()
  getPendingRequest() {
    return this.requestService.getPendingRequests();
  }

  @Get(':id')
  getRequestByID() {}

  @Get(':userid')
  getRequestByUserID() {}

  @Get('my/:id')
  getRequestsUserAccepted() {}

  @Post()
  createRequest(
    @Req() req: TAuthenticatedUserRequest,
    @Body() { date, comment }: Partial<IZischRequest>,
  ) {
    const requestData: Partial<IZischRequest> = {
      comment: comment,
      date: date,
      userid: req.user.uid,
    };

    return this.requestService.createRequest(requestData);
  }

  @Delete('id')
  deleteRequest() {}
}
