import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createJournalEntry = async (entry: string, createdBy: string) => {
  try {
    return await prisma.journalEntry.create({
      data: {
        entry,
        createdBy,
      },
    });
  } catch (error) {
    console.error('Error creating journal entry:', error);
    throw new Error('Failed to create journal entry');
  }
};
