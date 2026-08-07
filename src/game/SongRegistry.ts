export interface SongTrackData {
  id: string;
  title: string;
  subtitle: string;
  artist: string;
  audioUrl: string;
  coverImg: string;
  bgImg?: string;
  videoUrl?: string;
  bpm: number;
  isTutorial?: boolean;
  tags: string[];
  description: string;
}

export const BUILTIN_SONGS: SongTrackData[] = [
  {
    id: 'tutorial_stage',
    title: '🎓 新手競選培訓關卡',
    subtitle: 'TUTORIAL STAGE (5大Phase即時重複學習樂段)',
    artist: 'Yoaka Campaign Team',
    audioUrl: '', // Web Audio API Dynamic Phase Repeat Synthesizer
    coverImg: '/assets/yoaka_default.png',
    bpm: 120,
    isTutorial: true,
    tags: ['新手引導', '基礎音遊', 'Phase Repeat'],
    description: '專為首次參選的助手打造！5 大階段手把手重複樂段學習，學會投紙、發紙、雙擊與閃避黑粉！'
  },
  {
    id: 'track_election',
    title: 'yoaka競選之旅',
    subtitle: 'ELECTION JOURNEY (賽博里長主打歌)',
    artist: 'Yoaka Official',
    audioUrl: '', // Uses default BGM
    coverImg: '/yoaka_main.jpg',
    bpm: 132,
    tags: ['主打歌', '賽博龐克', '熱血拜票'],
    description: '熱血感滿滿的里長競選主打樂曲！輕快的雙軌律動波峰，帶領全區選民喊出支持聲！'
  },
  {
    id: 'track_cyber_night',
    title: '⚡ 賽博小島電音夜',
    subtitle: 'CYBER ISLAND NIGHT (高速節奏狂歡)',
    artist: 'Yoaka Beats',
    audioUrl: '',
    coverImg: '/assets/yoaka_kpop.png',
    bpm: 155,
    tags: ['高速電音', '極限Combo', '電音狂熱'],
    description: '155 BPM 高速節奏電音！充滿切分音與密集雙擊拍點，適合高階音遊玩家挑戰極限連擊！'
  },
  {
    id: 'track_secretary_speech',
    title: '👓 秘書學霸演說曲',
    subtitle: 'SECRETARY SPEECH (理性律動爵士)',
    artist: 'Yoaka Office Lab',
    audioUrl: '',
    coverImg: '/assets/yoaka_office.png',
    bpm: 118,
    tags: ['中速律動', '學霸政見', '爵士賽博'],
    description: '中速高雅的律動爵士節奏！適合穿著秘書學霸裝享受額外 +20% 票數加成！'
  }
];
