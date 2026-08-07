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
    id: 'tutorial_theme',
    title: '🎓 新手競選培訓主題曲',
    subtitle: 'TUTORIAL THEME (44.1kHz MP3 檔)',
    artist: 'Yoaka Campaign Team',
    audioUrl: '/audio/tutorial_theme.mp3',
    coverImg: '/assets/yoaka_default.png',
    bpm: 120,
    isTutorial: true,
    tags: ['新手引導', '基礎音遊'],
    description: '專為首次參選助手打造的新手節奏樂曲！放置路徑: public/audio/tutorial_theme.mp3'
  },
  {
    id: 'track_election',
    title: 'yoaka競選之旅',
    subtitle: 'ELECTION JOURNEY (賽博里長主打歌)',
    artist: 'Yoaka Official',
    audioUrl: '/audio/election_journey.mp3',
    coverImg: '/yoaka_main.jpg',
    bpm: 132,
    tags: ['主打歌', '賽博龐克', '熱血拜票'],
    description: '熱血感滿滿的里長競選主打樂曲！放置路徑: public/audio/election_journey.mp3'
  },
  {
    id: 'track_cyber_night',
    title: '⚡ 賽博小島電音夜',
    subtitle: 'CYBER ISLAND NIGHT (高速節奏狂歡)',
    artist: 'Yoaka Beats',
    audioUrl: '/audio/cyber_night.mp3',
    coverImg: '/assets/yoaka_kpop.png',
    bpm: 155,
    tags: ['高速電音', '極限Combo', '電音狂熱'],
    description: '155 BPM 高速節奏電音！放置路徑: public/audio/cyber_night.mp3'
  },
  {
    id: 'track_secretary_speech',
    title: '👓 秘書學霸演說曲',
    subtitle: 'SECRETARY SPEECH (理性律動爵士)',
    artist: 'Yoaka Office Lab',
    audioUrl: '/audio/secretary_speech.mp3',
    coverImg: '/assets/yoaka_office.png',
    bpm: 118,
    tags: ['中速律動', '學霸政見', '爵士賽博'],
    description: '中速高雅的律動爵士節奏！放置路徑: public/audio/secretary_speech.mp3'
  }
];
