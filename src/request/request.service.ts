import { Injectable } from '@nestjs/common';
import { IZischRequest } from 'src/models/request/ZischRequest.model';
import { DatabaseService } from 'src/shared/database.service';

@Injectable()
export class RequestService {
  constructor(private readonly databseService: DatabaseService) {}

  getPendingRequests() {
    return this.databseService.getDocumentDataFromCollection<IZischRequest>(
      'pending-requests',
    );
  }

  getActiveRequests() {}

  getRequestByID(id: string) {}

  getRequestByUserID(id: string) {}

  getRequestsByUserAccepted(id: string) {}

  createRequest({ comment, userid, date }: Partial<IZischRequest>) {
    return this.databseService.createDocument<Partial<IZischRequest>>(
      'pending-requests',
      {
        comment: comment,
        userid: userid,
        date: date,
        usersAccepted: [userid],
      },
    );
  }

  deleteRequest(id: string) {}
}
