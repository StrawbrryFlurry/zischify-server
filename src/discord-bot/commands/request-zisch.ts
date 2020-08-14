import { Message } from 'discord.js';
import moment, { Moment } from 'moment';
import { IZischRequest } from 'src/models/request/ZischRequest.model';
import { firestore as db } from 'firebase-admin';

export const requestZisch = async (message: Message, args: string) => {
  let requestDate;

  if (args) {
    requestDate = parseTimestamp(args);
  }

  if (requestDate) {
    return setupRequest(message, requestDate);
  }

  message.channel.sendMessage(
    '📆 What time do you want to schedule a Zisch for?',
  );

  let messages = await message.channel.awaitMessages(
    (m: Message) => m.author === message.author,
    { time: 10000, maxMatches: 1 },
  );

  let timestamp = messages
    .filter(m => !!m.content.match(/[0-9]{2}\:[0-9]{2}/))
    ?.last();

  if (!timestamp) {
    return message.channel.send(
      `Sorry, ${message.author.username} I didn't quite catch that`,
    );
  }

  let date = parseTimestamp(timestamp.content);

  if (!date) {
    return message.channel.send(
      `Sorry, ${message.author.username} there semes to be something wrong with your time syntax`,
    );
  }

  setupRequest(message, date);
};

const setupRequest = (message: Message, date: Moment) => {
  message.channel.send(
    `Aight, I'll set up a request for: ${date.format('MMMM Do YYYY, h:mm a')}`,
  );

  let request: Partial<IZischRequest> = {
    comment: message.content,
    date: date.toDate(),
    userid: message.author.id,
    usersAccepted: [message.author.id],
  };

  db()
    .collection('pending-requests')
    .doc()
    .set(request);
};

const parseTimestamp = (timestamp: string) => {
  const [hours, mins] = timestamp.split(':');
  if (+hours == NaN || +mins == NaN) return null;

  const date = moment()
    .set('hours', +hours)
    .set('minutes', +mins);

  if (date.isBefore(moment())) {
    date.add(1, 'days');
  }

  return date;
};
