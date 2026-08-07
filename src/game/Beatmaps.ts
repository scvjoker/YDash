import { BeatmapData, Note, CostumeId } from '../types/game';

export interface CostumeData {
  id: CostumeId;
  name: string;
  title: string;
  description: string;
  imgUrl: string;
  skillDescription: string;
  perk?: string;
  accentColor: string;
}

export const COSTUMES_DATA: CostumeData[] = [
  {
    id: 'campaign_vest',
    name: '競選 Yoaka',
    title: '基層熱血背心',
    description: '最親民的背心戰袍！失誤 Miss 扣血傷害減少 33%，新手拜票最佳保庇選擇。',
    imgUrl: '/assets/yoaka_default.png',
    skillDescription: '🛡️ 選民容錯：Miss 扣血減少 33%',
    perk: '🛡️ 選民容錯：Miss 扣血減少 33%',
    accentColor: '#00f0ff'
  },
  {
    id: 'office_glasses',
    name: '學霸 Yoaka',
    title: '眼鏡秘書套裝',
    description: '冷靜理性的分析派政見！獲得的總票數 (Score) 額外獲得 +20% 霸氣加成。',
    imgUrl: '/assets/yoaka_office.png',
    skillDescription: '👓 政見精準：得票數 (Score) +20% 增幅',
    perk: '👓 政見精準：得票數 (Score) +20% 增幅',
    accentColor: '#ffe600'
  },
  {
    id: 'kpop_idol',
    name: '偶像 Yoaka',
    title: '賽博滿分偶像',
    description: '全場閃耀的星光政見！FEVER 熱血爆發值積累速度直接翻倍！',
    imgUrl: '/assets/yoaka_kpop.png',
    skillDescription: '✨ 狂熱旋風：FEVER 積累速度翻倍',
    perk: '✨ 狂熱旋風：FEVER 積累速度翻倍',
    accentColor: '#ff007f'
  }
];

// Helper to generate a rhythmic, high-quality beatmap with genuine dual-track DUAL notes & obstacles
function generateRhythmicTrackBeatmap(
  id: string,
  title: string,
  artist: string,
  bpm: number,
  difficulty: 'Easy' | 'Normal' | 'Hard',
  songDurationSec: number = 120
): BeatmapData {
  const notes: Note[] = [];
  const secondsPerBeat = 60 / bpm;
  
  // Density multiplier based on difficulty
  const beatStep = difficulty === 'Easy' ? 1.0 : difficulty === 'Normal' ? 0.5 : 0.25;

  let timeIndex = 2.0;
  let counter = 0;

  while (timeIndex < songDurationSec - 3.0) {
    counter++;
    const formattedTime = parseFloat(timeIndex.toFixed(3));

    // Every 8th beat: Generate genuine DUAL STRIKE note on BOTH Air and Ground tracks!
    if (counter % 8 === 0) {
      notes.push({
        id: `${id}_dual_air_${formattedTime}`,
        time: formattedTime,
        track: 'air',
        type: 'voter',
        entity: 'voter_student',
        isDual: true
      });
      notes.push({
        id: `${id}_dual_ground_${formattedTime}`,
        time: formattedTime,
        track: 'ground',
        type: 'voter',
        entity: 'voter_office',
        isDual: true
      });
    } 
    // Every 6th beat: Generate Hater Obstacle
    else if (counter % 6 === 0) {
      const obsTrack = counter % 12 === 0 ? 'air' : 'ground';
      notes.push({
        id: `${id}_obs_${formattedTime}`,
        time: formattedTime,
        track: obsTrack,
        type: 'obstacle',
        entity: obsTrack === 'air' ? 'hater_shark' : 'hater_dog_board'
      });
    } 
    // Regular rhythm notes alternating between air and ground
    else {
      const track = counter % 2 === 0 ? 'air' : 'ground';
      notes.push({
        id: `${id}_note_${formattedTime}`,
        time: formattedTime,
        track,
        type: 'voter',
        entity: track === 'air' ? 'voter_student' : 'voter_office'
      });
    }

    timeIndex += secondsPerBeat * beatStep;
  }

  return {
    metadata: {
      id,
      title,
      artist,
      bpm,
      offset: 0,
      difficulty,
      coverColor: '#ffe600'
    },
    notes
  };
}

export const DEFAULT_BEATMAPS: BeatmapData[] = [
  generateRhythmicTrackBeatmap('track1_chief', '1. 巷弄拜票：里長起手式', 'Yoaka Campaign Team', 120, 'Normal', 120),
  generateRhythmicTrackBeatmap('track2_district', '2. 區長爭霸：賽博政見會', 'Yoaka Office Lab', 138, 'Hard', 140),
  generateRhythmicTrackBeatmap('track3_mayor', '3. 市長大選：小島電音夜', 'Yoaka Beats', 152, 'Hard', 160),
  generateRhythmicTrackBeatmap('track4_master', '4. 幫主登場：最高政壇巔峰', 'Yoaka Supreme', 168, 'Hard', 180)
];
