export interface SongData {
  id: string;
  title: string;
  subtitle: string;
  artist: string;
  bpm: number;
  duration: number; // Real Audio Duration in seconds
  cover: string;
  bg: string;
  audio: string;
  storyStage: '起' | '承' | '轉' | '合' | 'DLC';
  isRhapsody: boolean; // True if it's an extended high-difficulty Rhapsody track
  storyContext: string;
  difficultyRating: {
    Easy: number;   // Star rating 1~5
    Normal: number;
    Hard: number;
  };
}

export const SONG_REGISTRY: SongData[] = [
  {
    id: 'campaign_start',
    title: '競選出發！',
    subtitle: '街頭拜票 (有歌詞)',
    artist: 'Yoaka 競選樂團',
    bpm: 132,
    duration: 188,
    cover: '/assets/covers/cover_start.jpg',
    bg: '/assets/bgs/bg_start.jpg',
    audio: '/assets/audio/campaign_start.mp3',
    storyStage: '起',
    isRhapsody: false,
    storyContext: '【起】號角吹響！Yoaka 踏上 Web3 小島競選之旅，親切走入街頭，展開熱血拜票開場曲！',
    difficultyRating: {
      Easy: 2,
      Normal: 3,
      Hard: 4
    }
  },
  {
    id: 'street_campaign',
    title: '街頭拜票',
    subtitle: '街頭拜票狂想曲 (純音樂)',
    artist: 'Yoaka 競選樂團',
    bpm: 148,
    duration: 161,
    cover: '/assets/covers/cover_street.jpg',
    bg: '/assets/bgs/bg_street.jpg',
    audio: '/assets/audio/street_rhapsody_inst.mp3',
    storyStage: '承',
    isRhapsody: false,
    storyContext: '【承】熱鬧街頭純音樂演奏！流暢的切分音與熱情節奏，陪伴市民度過美好的拜票時光！',
    difficultyRating: {
      Easy: 2,
      Normal: 3,
      Hard: 4
    }
  },
  {
    id: 'street_rhapsody',
    title: '街頭拜票狂想曲',
    subtitle: '街頭拜票狂想曲 (高難/長曲)',
    artist: 'Yoaka 競選樂團',
    bpm: 155,
    duration: 130,
    cover: '/assets/covers/cover_street_rh.jpg',
    bg: '/assets/bgs/bg_street_rh.jpg',
    audio: '/assets/audio/street_rhapsody.mp3',
    storyStage: '承',
    isRhapsody: true,
    storyContext: '【承 - 狂想曲】走進熱鬧夜市與街道！狂想曲版本拍點層次豐富、切分音連擊密集，市民熱情響應！',
    difficultyRating: {
      Easy: 3,
      Normal: 4,
      Hard: 5
    }
  },
  {
    id: 'debate_battle',
    title: '辯論會激戰',
    subtitle: '辯論會激戰 (標準版)',
    artist: 'Yoaka 競選樂團',
    bpm: 172,
    duration: 165,
    cover: '/assets/covers/cover_debate.jpg',
    bg: '/assets/bgs/bg_debate.jpg',
    audio: '/assets/audio/debate_battle.mp3',
    storyStage: '轉',
    isRhapsody: false,
    storyContext: '【轉】政見發表會強勢對決！對手與黑粉猛烈攻防，需要敏捷反應與快速軌道閃避！',
    difficultyRating: {
      Easy: 3,
      Normal: 4,
      Hard: 5
    }
  },
  {
    id: 'debate_rhapsody',
    title: '辯論會激戰 (狂想曲)',
    subtitle: '辯論會激戰 (有歌詞 狂想曲)',
    artist: 'Yoaka 競選樂團',
    bpm: 178,
    duration: 321,
    cover: '/assets/covers/cover_debate_rh.jpg',
    bg: '/assets/bgs/bg_debate_rh.jpg',
    audio: '/assets/audio/debate_rhapsody_vocal.mp3',
    storyStage: '轉',
    isRhapsody: true,
    storyContext: '【轉 - 狂想高難版】延長版高難度辯論大決戰！歌詞與極速切分音交織，考驗手速極限！',
    difficultyRating: {
      Easy: 4,
      Normal: 5,
      Hard: 5
    }
  },
  {
    id: 'victory_night',
    title: '開票夜勝選大爆發',
    subtitle: '開票夜勝選大爆發 (標準版)',
    artist: 'Yoaka 競選樂團',
    bpm: 185,
    duration: 118,
    cover: '/assets/covers/cover_victory.jpg',
    bg: '/assets/bgs/bg_victory.jpg',
    audio: '/assets/audio/victory_night.mp3',
    storyStage: '合',
    isRhapsody: false,
    storyContext: '【合】票數一路遙遙領先！全場歡呼熱血全開，雙倍得票與 Fever 爆發迎接勝選時刻！',
    difficultyRating: {
      Easy: 3,
      Normal: 4,
      Hard: 5
    }
  },
  {
    id: 'victory_rhapsody',
    title: '開票夜勝選大爆發 (狂想曲)',
    subtitle: '開票夜勝選大爆發 (有歌詞 狂想曲)',
    artist: 'Yoaka 競選樂團',
    bpm: 190,
    duration: 303,
    cover: '/assets/covers/cover_victory_rh.jpg',
    bg: '/assets/bgs/bg_victory_rh.jpg',
    audio: '/assets/audio/victory_rhapsody_vocal.mp3',
    storyStage: '合',
    isRhapsody: true,
    storyContext: '【合 - 終極狂想曲】全曲長度最長、難度最高的高潮勝選終曲！狂歡音浪無限爆發！',
    difficultyRating: {
      Easy: 4,
      Normal: 5,
      Hard: 5
    }
  },
  {
    id: 'dlc_whats_next',
    title: 'Whats Next?',
    subtitle: '✨ 我推的阿狸 DLC 特典',
    artist: 'A Li & Jay Lin',
    bpm: 80,
    duration: 195,
    cover: '/assets/cover_whats_next.png',
    bg: '/assets/bgs/bg_whats_next.mp4',
    audio: '/assets/audio/whats_next_ali_jaylin.mp3',
    storyStage: 'DLC',
    isRhapsody: true,
    storyContext: '【DLC 特別企劃】由 A Li & Jay Lin 強強聯手打造的歌曲！優美歌聲與緩緩鋼琴交織，迎向下一階段的人生挑戰！',
    difficultyRating: {
      Easy: 3,
      Normal: 4,
      Hard: 5
    }
  }
];
