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
    id: 'track1_chief',
    title: '1. 巷弄拜票：里長起手式',
    subtitle: 'ALLEY CAMPAIGN (120 BPM - 基層起跑)',
    artist: 'Yoaka Campaign Team',
    audioUrl: '/audio/track1_chief.mp3',
    coverImg: '/assets/yoaka_default.png',
    bpm: 120,
    tags: ['里長參選', '基層拜票', '輕鬆熱身'],
    description: 'Yoaka 競選的第一步！走入大街小巷發放面紙傳單，累積基層里民的最純粹支持度！'
  },
  {
    id: 'track2_district',
    title: '2. 區長爭霸：賽博政見會',
    subtitle: 'DISTRICT SHOWDOWN (138 BPM - 激戰選戰)',
    artist: 'Yoaka Office Lab',
    audioUrl: '/audio/track2_district.mp3',
    coverImg: '/assets/yoaka_office.png',
    bpm: 138,
    tags: ['區長競選', '賽博政見', '學霸加成'],
    description: '挺進區長大選！穿上學霸秘書戰袍，在賽博政見發表會上展現精準魄力！'
  },
  {
    id: 'track3_mayor',
    title: '3. 市長大選：小島電音夜',
    subtitle: 'MAYOR ELECTION (152 BPM - 全島狂歡)',
    artist: 'Yoaka Beats',
    audioUrl: '/audio/track3_mayor.mp3',
    coverImg: '/assets/yoaka_kpop.png',
    bpm: 152,
    tags: ['市長大選', '賽博電音', '偶像魅力'],
    description: '全島矚目的市長級熱血大選！搭配賽博偶像戰袍與 152 BPM 電音掀起全島熱潮！'
  },
  {
    id: 'track4_master',
    title: '4. 幫主登場：最高政壇巔峰',
    subtitle: 'GUILD MASTER (168 BPM - 頂峰對決)',
    artist: 'Yoaka Supreme',
    audioUrl: '/audio/track4_master.mp3',
    coverImg: '/yoaka_main.jpg',
    bpm: 168,
    tags: ['最高巔峰', '幫主登場', '極限音遊'],
    description: '榮登 Web3 小島最高政壇幫主！168 BPM 超高速密集拍點，考驗真正的競選王者！'
  }
];
