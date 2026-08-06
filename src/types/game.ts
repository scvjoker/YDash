export type TrackType = 'air' | 'ground';

export type NoteType = 'voter' | 'hold' | 'obstacle' | 'tissue_box' | 'rapid_mash';

export type EntityType = 
  | 'voter_office'     // 上班族選民
  | 'voter_student'    // 大學生選民
  | 'voter_cloud'      // 雲端粉絲
  | 'hater_dog_board'  // 黑粉狗姊照片/方塊男立牌
  | 'hater_shark_rose' // 鯊魚跪地獻玫瑰
  | 'tissue_bonus';    // 大包衛生紙禮包

export interface Note {
  id: string;
  time: number;       // 打擊時間 (秒)
  track: TrackType;
  type: NoteType;
  entity: EntityType;
  duration?: number;  // Hold 時長
  isDual?: boolean;   // 上下軌同時按下
  isMash?: boolean;   // 瘋狂連打 Note
  hit?: boolean;
  judgement?: 'perfect' | 'great' | 'miss';
}

export interface BeatmapMetadata {
  id: string;
  title: string;
  artist: string;
  bpm: number;
  offset: number;
  difficulty: 'Easy' | 'Normal' | 'Hard' | 'Master' | 'Custom';
  coverColor: string;
}

export interface BeatmapData {
  metadata: BeatmapMetadata;
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

export type GameState = 'menu' | 'costumes' | 'playing' | 'editor' | 'result';

export interface GameStats {
  score: number;        // 總獲票數
  supportRate: number;  // 選民支持度 (%)
  combo: number;
  maxCombo: number;
  perfectCount: number;
  greatCount: number;
  missCount: number;
  feverGauge: number;   // [0 - 100]
  isFeverActive: boolean;
}
