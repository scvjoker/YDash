import { BeatmapData } from '../types/game';

export const DEFAULT_BEATMAPS: BeatmapData[] = [
  {
    metadata: {
      id: 'yoaka_election_journey',
      title: '👑 yoaka競選之旅 (Official Anthem)',
      artist: 'Yoaka & Web3 Election Band',
      bpm: 135,
      offset: 0.1,
      difficulty: 'Master',
      coverColor: '#ffe600'
    },
    notes: [
      { id: 'yj1', time: 1.0, track: 'ground', type: 'voter', entity: 'voter_office' },
      { id: 'yj2', time: 1.5, track: 'air', type: 'voter', entity: 'voter_cloud' },
      { id: 'yj3', time: 2.0, track: 'ground', type: 'voter', entity: 'voter_student' },
      { id: 'yj4', time: 2.5, track: 'air', type: 'voter', entity: 'voter_cloud' },
      { id: 'yj5', time: 3.2, track: 'ground', type: 'obstacle', entity: 'hater_dog_board' },
      { id: 'yj6', time: 3.8, track: 'air', type: 'obstacle', entity: 'hater_shark_rose' },
      { id: 'yj7', time: 4.5, track: 'ground', type: 'tissue_box', entity: 'tissue_bonus' },
      { id: 'yj8', time: 5.2, track: 'ground', type: 'hold', entity: 'voter_student', duration: 1.5 },
      { id: 'yj9', time: 7.0, track: 'air', type: 'voter', entity: 'voter_cloud' },
      { id: 'yj10', time: 7.8, track: 'ground', type: 'voter', entity: 'voter_office' },
      { id: 'yj11', time: 8.5, track: 'ground', type: 'tissue_box', entity: 'tissue_bonus' }
    ]
  }
];

export const COSTUMES_DATA = [
  {
    id: 'campaign_vest',
    name: '預設競選背心裝',
    subtitle: 'web3 里長候選人經典戰袍',
    description: '經典熱血紅藍背心 + 面紙斜背包 + 競選鴨舌帽。拜票最親民，支持度恢復加成 +10%！',
    perk: '選民支持度扣減 -15%',
    accentColor: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, #00f0ff 0%, #0077b6 100%)'
  },
  {
    id: 'office_glasses',
    name: '襯衫領帶眼鏡裝',
    subtitle: '專業俐落幹練幫主造型',
    description: '黑框眼鏡 + 精緻白襯衫 + 窄版領帶。理智高冷，Perfect 判定獲票數加成 +20%！',
    perk: '獲票數 (Score) 增加 +20%',
    accentColor: '#ffe600',
    bgGradient: 'linear-gradient(135deg, #ffe600 0%, #ffb703 100%)'
  },
  {
    id: 'kpop_idol',
    name: '韓風女團裝',
    subtitle: 'web3 舞台狂歡舞台女王',
    description: '耀眼亮片舞台短裙 + 賽博光電飾品。魅力四射，Fever Mode 能量累積速度雙倍！',
    perk: 'Fever 能量累積速度 200%',
    accentColor: '#ff007f',
    bgGradient: 'linear-gradient(135deg, #ff007f 0%, #ff4d6d 100%)'
  }
] as const;
