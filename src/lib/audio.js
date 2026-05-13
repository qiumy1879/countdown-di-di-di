// 音频工具函数
export const playNotificationSound = () => {
  return new Promise((resolve) => {
    try {
      // 尝试使用本地音频文件
      const audio = new Audio('/notification.mp3');
      
      // 设置音频播放完成后的回调
      audio.onended = () => {
        resolve();
      };
      
      // 设置错误处理
      audio.onerror = (e) => {
        console.error('音频播放失败:', e);
        // 如果本地音频失败，尝试使用Web Audio API作为备选方案
        fallbackToWebAudio().then(resolve);
      };
      
      // 播放音频
      audio.play().catch(e => {
        console.error('音频播放被阻止:', e);
        // 如果自动播放被阻止，尝试使用Web Audio API
        fallbackToWebAudio().then(resolve);
      });
    } catch (error) {
      console.error('创建音频对象失败:', error);
      // 如果创建音频对象失败，尝试使用Web Audio API
      fallbackToWebAudio().then(resolve);
    }
  });
};

// Web Audio API 备选方案
const fallbackToWebAudio = () => {
  return new Promise((resolve) => {
    try {
      if (window.AudioContext || window.webkitAudioContext) {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.value = 800;
        oscillator.type = 'sine';
        
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.5);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
        
        // 等待音频播放完成
        setTimeout(resolve, 600);
        return;
      }
    } catch (error) {
      console.error('Web Audio API播放失败:', error);
    }
    
    // 如果所有方法都失败，直接resolve
    resolve();
  });
};

// 检查浏览器是否支持音频
export const isAudioSupported = () => {
  return !!(window.AudioContext || window.webkitAudioContext) || !!window.Audio;
};
