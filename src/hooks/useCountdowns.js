import { useState, useEffect, useCallback, useRef } from 'react';
import useLocalStorage from './useLocalStorage';
import { playNotificationSound } from '../lib/audio';

const useCountdowns = () => {
  const [countdowns, setCountdowns] = useLocalStorage('countdowns', []);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [notifiedCountdowns, setNotifiedCountdowns] = useLocalStorage('notifiedCountdowns', []);
  const audioPlayedRef = useRef({});

  // 更精确的定时器，每100ms更新一次
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(Date.now());
    }, 100);

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

  // 检查并播放提醒
  useEffect(() => {
    const updatedCountdowns = getUpdatedCountdowns();
    
    const checkExpiredCountdowns = async () => {
      for (const countdown of updatedCountdowns) {
        const isExpired = countdown.remainingTime <= 0;
        const isCompleted = countdown.completed;
        const hasNotified = notifiedCountdowns.includes(countdown.id);
        const alreadyPlayed = audioPlayedRef.current[countdown.id];
        
        // 如果倒计时过期、未完成、未提醒、且未播放过音频
        if (isExpired && !isCompleted && !hasNotified && !alreadyPlayed) {
          // 立即标记已播放，防止重复
          audioPlayedRef.current[countdown.id] = true;
          
          // 立即播放音频
          playNotificationSound();
          
          // 添加到已提醒列表
          setNotifiedCountdowns(prev => [...prev, countdown.id]);
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
    delete audioPlayedRef.current[id];
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
    delete audioPlayedRef.current[id];
  }, [setCountdowns, setNotifiedCountdowns]);

  // 删除倒计时
  const deleteCountdown = useCallback((id) => {
    setCountdowns(prevCountdowns =>
      prevCountdowns.filter(countdown => countdown.id !== id)
    );
    
    setNotifiedCountdowns(prev => prev.filter(notifiedId => notifiedId !== id));
    delete audioPlayedRef.current[id];
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
