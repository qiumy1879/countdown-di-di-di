import { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from './useLocalStorage';
import { playNotificationSound } from '../lib/audio';

const useCountdowns = () => {
  const [countdowns, setCountdowns] = useLocalStorage('countdowns', []);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [notifiedCountdowns, setNotifiedCountdowns] = useLocalStorage('notifiedCountdowns', []);
  const audioPlayedRef = useRef(false);

  // 每秒更新当前时间
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // 计算剩余时间
  const calculateRemainingTime = useCallback((targetTime) => {
    const remaining = Math.floor((targetTime - currentTime) / 1000);
    return Math.max(0, remaining);
  }, [currentTime]);

  // 获取带有更新剩余时间的倒计时列表
  const getUpdatedCountdowns = useCallback(() => {
    return countdowns.map(countdown => ({
      ...countdown,
      remainingTime: calculateRemainingTime(countdown.targetTime)
    })).sort((a, b) => {
      if (!a.completed && !b.completed) {
        return a.remainingTime - b.remainingTime;
      }
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      return a.remainingTime - b.remainingTime;
    });
  }, [countdowns, calculateRemainingTime]);

  // 检查并播放提醒 - 现在放在 getUpdatedCountdowns 之后定义
  useEffect(() => {
    const updatedCountdowns = getUpdatedCountdowns();
    
    console.log('[音频检测] useEffect 触发');
    console.log('[音频检测] updatedCountdowns:', updatedCountdowns);
    console.log('[音频检测] notifiedCountdowns:', notifiedCountdowns);
    console.log('[音频检测] audioPlayedRef:', audioPlayedRef.current);
    
    const checkExpiredCountdowns = async () => {
      if (audioPlayedRef.current) {
        console.log('[音频检测] audioPlayedRef 为 true，跳过');
        return;
      }
      
      for (const countdown of updatedCountdowns) {
        console.log('[音频检测] 检查倒计时:', countdown.id, countdown.title, 'remainingTime:', countdown.remainingTime);
        const isExpired = countdown.remainingTime <= 0;
        const isCompleted = countdown.completed;
        const hasNotified = notifiedCountdowns.includes(countdown.id);
        
        console.log('[音频检测] isExpired:', isExpired, 'isCompleted:', isCompleted, 'hasNotified:', hasNotified);
        
        if (isExpired && !isCompleted && !hasNotified) {
          console.log('[音频检测] 触发音频播放!');
          audioPlayedRef.current = true;
          
          await playNotificationSound();
          
          setNotifiedCountdowns(prev => [...prev, countdown.id]);
          
          setTimeout(() => {
            audioPlayedRef.current = false;
          }, 1000);
        }
      }
    };

    checkExpiredCountdowns();
  }, [currentTime, notifiedCountdowns, setNotifiedCountdowns, getUpdatedCountdowns]);

  // 添加新的倒计时
  const addCountdown = useCallback((newCountdown) => {
    setCountdowns(prevCountdowns => {
      const updatedCountdowns = [...prevCountdowns, newCountdown];
      return updatedCountdowns.sort((a, b) => a.remainingTime - b.remainingTime);
    });
  }, [setCountdowns]);

  // 切换倒计时完成状态
  const toggleCountdown = useCallback((id) => {
    setCountdowns(prevCountdowns =>
      prevCountdowns.map(countdown =>
        countdown.id === id
          ? { ...countdown, completed: !countdown.completed }
          : countdown
      )
    );
    
    setNotifiedCountdowns(prev => prev.filter(notifiedId => notifiedId !== id));
  }, [setCountdowns, setNotifiedCountdowns]);

  // 重新倒计时
  const restartCountdown = useCallback((id) => {
    setCountdowns(prevCountdowns =>
      prevCountdowns.map(countdown => {
        if (countdown.id === id) {
          const now = Date.now();
          const newTargetTime = now + (countdown.targetTime - countdown.createdAt);
          return {
            ...countdown,
            targetTime: newTargetTime,
            createdAt: now,
            completed: false
          };
        }
        return countdown;
      })
    );
    
    setNotifiedCountdowns(prev => prev.filter(notifiedId => notifiedId !== id));
  }, [setCountdowns, setNotifiedCountdowns]);

  // 删除倒计时
  const deleteCountdown = useCallback((id) => {
    setCountdowns(prevCountdowns =>
      prevCountdowns.filter(countdown => countdown.id !== id)
    );
    
    setNotifiedCountdowns(prev => prev.filter(notifiedId => notifiedId !== id));
  }, [setCountdowns, setNotifiedCountdowns]);

  return {
    countdowns: getUpdatedCountdowns(),
    addCountdown,
    toggleCountdown,
    restartCountdown,
    deleteCountdown
  };
};

export default useCountdowns;