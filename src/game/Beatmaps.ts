import { BeatmapData, CostumeInfo } from '../types/game';

export const COSTUMES_DATA: CostumeInfo[] = [
  {
    id: 'campaign_vest',
    name: '競選 Yoaka',
    subtitle: 'web3 里長候選人戰袍',
    description: '標準候選人戰服！展現最真誠的親和力與拜票衝勁。',
    perk: '✨ 專屬技能：Miss 扣血減少 33%',
    accentColor: '#00f0ff',
    bgGradient: 'linear-gradient(135deg, rgba(0, 240, 255, 0.15), rgba(0, 119, 182, 0.25))'
  },
  {
    id: 'office_glasses',
    name: '學霸 Yoaka',
    subtitle: '專業俐落幹練幫主造型',
    description: '專業嚴謹的秘書學霸風！展現精準政見與理性魄力。',
    perk: '✨ 專屬技能：得分獲得額外 +20% 票數',
    accentColor: '#ffe600',
    bgGradient: 'linear-gradient(135deg, rgba(255, 230, 0, 0.15), rgba(255, 183, 3, 0.25))'
  },
  {
    id: 'kpop_idol',
    name: 'K-Pop 閃耀偶像裝',
    subtitle: 'web3 舞台狂歡女王',
    description: 'KPOP舞台裝 + 賽博光電飾品。魅力四射，Fever Mode 雙倍票數狂熱能量累積速度達到 200%！',
    perk: '✨ 專屬技能：Fever 能量累積速度 200%',
    accentColor: '#ff007f',
    bgGradient: 'linear-gradient(135deg, rgba(255, 0, 127, 0.15), rgba(216, 0, 104, 0.25))'
  }
];

// Single Track Main Beatmap: "yoaka競選之旅"
export const DEFAULT_BEATMAPS: BeatmapData[] = [
  {
    metadata: {
      id: 'yoaka_journey',
      title: 'yoaka競選之旅',
      artist: 'You & Yoaka AI',
      bpm: 135,
      offset: 0,
      difficulty: 'Master',
      coverColor: '#ff007f'
    },
    notes: [
      { id: 'n1', time: 5.0, track: 'ground', type: 'voter', entity: 'voter_office' },
      { id: 'n2', time: 5.4, track: 'air', type: 'voter', entity: 'voter_student' },
      { id: 'n3', time: 5.8, track: 'ground', type: 'voter', entity: 'voter_office' },
      { id: 'n4', time: 6.2, track: 'air', type: 'voter', entity: 'voter_cloud' },
      { id: 'n5', time: 6.6, track: 'ground', type: 'obstacle', entity: 'hater_shark' },
      { id: 'n6', time: 7.0, track: 'ground', type: 'voter', entity: 'voter_office' },
      { id: 'n7', time: 7.4, track: 'air', type: 'voter', entity: 'voter_student', isDual: true },
      { id: 'n8', time: 7.4, track: 'ground', type: 'voter', entity: 'voter_office', isDual: true }
    ]
  }
];
