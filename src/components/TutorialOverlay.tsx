import React from 'react';
import { FastForward, CheckCircle, Award, ArrowRight } from 'lucide-react';

export interface TutorialPhaseInfo {
  phase: number;
  title: string;
  instruction: string;
  keyHint: string;
  targetCount: number;
  currentCount: number;
}

interface TutorialOverlayProps {
  phaseInfo: TutorialPhaseInfo;
  onNextStep: () => void;
  isCompleted: boolean;
  onCompleteTutorial: () => void;
}

export const TUTORIAL_PHASES_DATA = [
  {
    phase: 1,
    title: '第一階段：空中投紙 (AIR VOTER)',
    instruction: '當【藍色音符】抵達靶心時，按下按鍵或點擊【上軌】投發傳單！',
    keyHint: '按鍵: D / F  或 點擊左下方藍鈕',
    targetCount: 3
  },
  {
    phase: 2,
    title: '第二階段：地面發紙 (GROUND VOTER)',
    instruction: '當【粉色音符】抵達靶心時，按下按鍵或點擊【下軌】發送傳單！',
    keyHint: '按鍵: J / K  或 點擊右下方粉紐',
    targetCount: 3
  },
  {
    phase: 3,
    title: '第三階段：雙擊打擊 (DUAL STRIKE)',
    instruction: '當【金黃雙擊音符】抵達時，同時按下【上軌 + 下軌】雙管齊下！',
    keyHint: '按鍵: D+J / F+K  雙軌同時壓下',
    targetCount: 2
  },
  {
    phase: 4,
    title: '第四階段：閃避黑粉 (HATER OBSTACLE)',
    instruction: '遇到【狗頭板 / 鯊魚黑粉】時，切換軌道成功閃避！',
    keyHint: '切換軌道避開黑粉即可！',
    targetCount: 2
  },
  {
    phase: 5,
    title: '第五階段：FEVER 雙倍熱血爆發',
    instruction: '累積熱血值觸發【FEVER MODE】，獲得雙倍得票數加成！',
    keyHint: '感受雙倍票數熱血狂歡！',
    targetCount: 2
  }
];

export const TutorialOverlay: React.FC<TutorialOverlayProps> = ({
  phaseInfo,
  onNextStep,
  isCompleted,
  onCompleteTutorial
}) => {
  if (isCompleted) {
    return (
      <div style={{
        position: 'absolute',
        inset: 0,
        backgroundColor: 'rgba(7, 8, 20, 0.92)',
        backdropFilter: 'blur(16px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 60,
        padding: '1rem'
      }}>
        <div className="cyber-panel" style={{
          width: '520px',
          maxWidth: '92vw',
          padding: '2.2rem 1.8rem',
          textAlign: 'center',
          border: '2.5px solid #ffe600',
          boxShadow: '0 0 40px rgba(255, 230, 0, 0.5)',
          position: 'relative'
        }}>
          <div style={{
            width: '70px',
            height: '70px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #ffe600, #ffb703)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1rem auto',
            boxShadow: '0 0 25px #ffe600'
          }}>
            <Award size={40} color="#000" />
          </div>

          <h2 style={{
            fontSize: '2.2rem',
            fontFamily: 'Chakra Petch, sans-serif',
            fontWeight: 900,
            color: '#ffe600',
            marginBottom: '0.3rem',
            textShadow: '0 0 15px rgba(255,230,0,0.6)'
          }}>
            🎓 競選培訓合格證書！
          </h2>

          <p style={{ color: '#00f0ff', fontWeight: 800, fontSize: '1.05rem', marginBottom: '1rem' }}>
            「恭喜您成功通過 Yoaka 里長助手音遊全套培訓！」
          </p>

          <p style={{ color: '#aaa', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '1.8rem' }}>
            您已完全掌握上軌投紙、下軌發紙、雙擊同按與黑粉閃避技巧！現在，帶著最飽滿的熱情，開啟正式的競選拜票之旅吧！
          </p>

          <button
            className="muse-btn"
            onClick={onCompleteTutorial}
            style={{ width: '100%', fontSize: '1.25rem', padding: '0.9rem' }}
          >
            <span><CheckCircle size={22} /> 拿取合格證書返回選單 (FINISHED)</span>
          </button>
        </div>
      </div>
    );
  }

  const progressPct = Math.min(100, (phaseInfo.currentCount / phaseInfo.targetCount) * 100);

  return (
    <div style={{
      position: 'absolute',
      top: '75px',
      left: '50%',
      transform: 'translateX(-50%)',
      zIndex: 30,
      pointerEvents: 'auto',
      width: '680px',
      maxWidth: '92vw'
    }}>
      <div className="cyber-panel" style={{
        padding: '0.75rem 1.4rem',
        border: '2px solid #ffe600',
        boxShadow: '0 0 25px rgba(255, 230, 0, 0.45)',
        backgroundColor: 'rgba(10, 12, 28, 0.92)',
        backdropFilter: 'blur(10px)',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
      }}>
        {/* Top Header Row: Title & Next Step Button */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              background: '#ffe600',
              color: '#000',
              fontWeight: 900,
              padding: '2px 10px',
              borderRadius: '12px',
              fontSize: '0.78rem'
            }}>
              PHASE {phaseInfo.phase} / 5
            </span>
            <h3 style={{ fontSize: '1.1rem', color: '#ffe600', fontWeight: 900, fontFamily: 'Chakra Petch, sans-serif' }}>
              {phaseInfo.title}
            </h3>
          </div>

          {/* MANUAL NEXT STEP BUTTON (手動下一步) */}
          <button
            onClick={onNextStep}
            style={{
              background: 'linear-gradient(135deg, #ffe600 0%, #ffb703 100%)',
              border: '1.5px solid #fff',
              color: '#000',
              borderRadius: '16px',
              padding: '4px 14px',
              fontFamily: 'Chakra Petch, sans-serif',
              fontWeight: 900,
              fontSize: '0.82rem',
              display: 'flex',
              alignItems: 'center',
              gap: '4px',
              cursor: 'pointer',
              boxShadow: '0 0 14px rgba(255,230,0,0.6)',
              transition: 'all 0.2s'
            }}
          >
            <span>⏭️ 手動下一步</span>
            <FastForward size={14} />
          </button>
        </div>

        {/* Instruction & Key Hint */}
        <p style={{ color: '#fff', fontSize: '0.9rem', fontWeight: 800, margin: 0 }}>
          {phaseInfo.instruction}
        </p>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '2px' }}>
          <span style={{ color: '#00f0ff', fontSize: '0.8rem', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <ArrowRight size={14} /> {phaseInfo.keyHint}
          </span>

          {/* Progress Counter Pill */}
          <span style={{ fontSize: '0.85rem', color: '#ffe600', fontWeight: 900 }}>
            達成次數: {phaseInfo.currentCount} / {phaseInfo.targetCount}
          </span>
        </div>

        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '6px',
          background: 'rgba(0,0,0,0.6)',
          borderRadius: '3px',
          overflow: 'hidden',
          marginTop: '2px'
        }}>
          <div style={{
            width: `${progressPct}%`,
            height: '100%',
            background: 'linear-gradient(90deg, #ffe600 0%, #00f0ff 100%)',
            transition: 'width 0.2s ease-out'
          }} />
        </div>
      </div>
    </div>
  );
};
