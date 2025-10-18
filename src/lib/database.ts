import { database, ref, set, get, push, update, onValue, off } from './firebase';

export interface Battle {
  id: string;
  creator: string;
  creatorFid: number;
  question: string;
  votingEndsAt: string;
  sideA: {
    emoji: string;
    label: string;
    votes: number;
  };
  sideB: {
    emoji: string;
    label: string;
    votes: number;
  };
  status: 'active' | 'ended';
  createdAt: string;
}

export interface Opinion {
  id: string;
  battleId: string;
  username: string;
  fid: number;
  opinion: string;
  side: 'A' | 'B';
  weight: number;
  createdAt: string;
  upvotes: number;
}

export interface Vote {
  battleId: string;
  fid: number;
  side: 'A' | 'B';
  timestamp: string;
}

// Battles
export async function createBattle(battle: Omit<Battle, 'id' | 'createdAt'>): Promise<string> {
  const battlesRef = ref(database, 'battles');
  const newBattleRef = push(battlesRef);
  const battleId = newBattleRef.key!;
  
  await set(newBattleRef, {
    ...battle,
    id: battleId,
    createdAt: new Date().toISOString(),
  });
  
  return battleId;
}

export async function getBattle(battleId: string): Promise<Battle | null> {
  const battleRef = ref(database, `battles/${battleId}`);
  const snapshot = await get(battleRef);
  
  if (snapshot.exists()) {
    return snapshot.val();
  }
  return null;
}

export async function getActiveBattles(): Promise<Battle[]> {
  const battlesRef = ref(database, 'battles');
  const snapshot = await get(battlesRef);
  
  if (snapshot.exists()) {
    const battles: Battle[] = [];
    snapshot.forEach((childSnapshot) => {
      const battle = childSnapshot.val();
      if (battle.status === 'active') {
        battles.push(battle);
      }
    });
    return battles.sort((a, b) => 
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  }
  return [];
}

export function subscribeToBattle(battleId: string, callback: (battle: Battle) => void): () => void {
  const battleRef = ref(database, `battles/${battleId}`);
  const listener = onValue(battleRef, (snapshot) => {
    if (snapshot.exists()) {
      callback(snapshot.val());
    }
  });
  
  return () => off(battleRef, 'value', listener);
}

// Votes
export async function submitVote(vote: Vote): Promise<void> {
  const { battleId, fid, side } = vote;
  
  // Check if user already voted
  const voteRef = ref(database, `votes/${battleId}/${fid}`);
  const existingVote = await get(voteRef);
  
  if (existingVote.exists()) {
    throw new Error('You have already voted on this battle');
  }
  
  // Record the vote
  await set(voteRef, {
    side,
    timestamp: new Date().toISOString(),
  });
  
  // Update battle vote counts
  const battleRef = ref(database, `battles/${battleId}`);
  const battleSnapshot = await get(battleRef);
  
  if (battleSnapshot.exists()) {
    const battle = battleSnapshot.val();
    const sideKey = side === 'A' ? 'sideA' : 'sideB';
    await update(battleRef, {
      [`${sideKey}/votes`]: battle[sideKey].votes + 1,
    });
  }
}

export async function getUserVote(battleId: string, fid: number): Promise<'A' | 'B' | null> {
  const voteRef = ref(database, `votes/${battleId}/${fid}`);
  const snapshot = await get(voteRef);
  
  if (snapshot.exists()) {
    return snapshot.val().side;
  }
  return null;
}

// Opinions
export async function submitOpinion(opinion: Omit<Opinion, 'id' | 'createdAt' | 'upvotes'>): Promise<string> {
  const opinionsRef = ref(database, `opinions/${opinion.battleId}`);
  const newOpinionRef = push(opinionsRef);
  const opinionId = newOpinionRef.key!;
  
  await set(newOpinionRef, {
    ...opinion,
    id: opinionId,
    createdAt: new Date().toISOString(),
    upvotes: 0,
  });
  
  return opinionId;
}

export async function getOpinions(battleId: string): Promise<Opinion[]> {
  const opinionsRef = ref(database, `opinions/${battleId}`);
  const snapshot = await get(opinionsRef);
  
  if (snapshot.exists()) {
    const opinions: Opinion[] = [];
    snapshot.forEach((childSnapshot) => {
      opinions.push(childSnapshot.val());
    });
    return opinions.sort((a, b) => b.upvotes - a.upvotes);
  }
  return [];
}

export function subscribeToOpinions(battleId: string, callback: (opinions: Opinion[]) => void): () => void {
  const opinionsRef = ref(database, `opinions/${battleId}`);
  const listener = onValue(opinionsRef, (snapshot) => {
    if (snapshot.exists()) {
      const opinions: Opinion[] = [];
      snapshot.forEach((childSnapshot) => {
        opinions.push(childSnapshot.val());
      });
      callback(opinions.sort((a, b) => b.upvotes - a.upvotes));
    } else {
      callback([]);
    }
  });
  
  return () => off(opinionsRef, 'value', listener);
}

export async function upvoteOpinion(battleId: string, opinionId: string): Promise<void> {
  const opinionRef = ref(database, `opinions/${battleId}/${opinionId}`);
  const snapshot = await get(opinionRef);
  
  if (snapshot.exists()) {
    const opinion = snapshot.val();
    await update(opinionRef, {
      upvotes: opinion.upvotes + 1,
    });
  }
}
