import { firestore as db } from 'firebase-admin';
import { Message, RichEmbed } from 'discord.js';

export const getPendingRequests = async (message: Message) => {
  const query = await db()
    .collection('pending-requests')
    .get();
};
