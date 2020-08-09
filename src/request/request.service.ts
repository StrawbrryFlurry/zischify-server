import { Injectable } from '@nestjs/common';
import { IZischRequest } from 'src/models/request/ZischRequest.model';

@Injectable()
export class RequestService {
  getAllActiveRequests() {}

  getRequestByID(id: string) {}

  getRequestByUserID(id: string) {}

  getRequestsUserAccepted(id: string) {}

  createRequest({ comment, userid, date }: Partial<IZischRequest>) {}

  deleteRequest(id: string) {}
}
