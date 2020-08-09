export interface IZischRequest {
  id: string;
  userid: string;
  comment: string;
  date: Date;
  usersAccepted: string[];
  usersRejected: string[];
}
