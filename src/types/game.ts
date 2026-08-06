export type GameState = 'menu' | 'playing' | 'paused' | 'result' | 'costumes' | 'editor';

export type TrackType = 'air' | 'ground';
export type EntityType = 'voter_office' | 'voter_student' | 'voter_cloud' | 'hater_dog_board' | 'hater_shark_rose';
export type NoteType = 'voter' | 'obstacle' | 'hold';

export interface Note {
  id: string;
  time: number;
  track: 'air' | 'ground';
  type: NoteType;
  entity: string;
  isDual?: boolean;
  hit?: boolean;
  judgement?: 'perfect' | 'great' | 'miss';
}

export interface BeatmapData {
  metadata: {
    id: string;
    title: string;
    artist: string;
    bpm: number;
    offset: number;
    difficulty: string;
    coverColor: string;
  };
  notes: Note[];
}

export type CostumeId = 'campaign_vest' | 'office_glasses' | 'kpop_idol';

export interface CostumeInfo {
  id: CostumeId;
  name: string;
  subtitle: string;
  description: string;
  perk: string;
  accentColor: string;
  bgGradient: string;
}

export interface GameStats {
  score: number;
  supportRate: number;
  combo: number;
  maxCombo: number;
  perfectCount: number;
  greatCount: number;
  missCount: number;
  feverGauge: number;
  isFeverActive: boolean;
  totalNotesCount?: number;
}
