import React from 'react';
import { Trash2, Clock, Bell, RotateCcw } from 'lucide-react';

const CountdownItem = ({ countdown, onToggle, onDelete, onRestart }) => {
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (24 * 60 * 60));
    const hours = Math.floor((seconds % (24 * 60 * 60)) / (60 * 60));
    const minutes = Math.floor((seconds % (60 * 60)) / 60);
    const secs = seconds % 60;

    if (days > 0) {
      return `${days}天 ${hours}小时 ${minutes}分钟`;
    } else if (hours > 0) {
      return `${hours}小时 ${minutes}分钟 ${secs}秒`;
    } else if (minutes > 0) {
      return `${minutes}分钟 ${secs}秒`;
    } else {
      return `${secs}秒`;
    }
  };

  const getBackgroundColor = (remainingTime) => {
    const oneMonth = 30 * 24 * 60 * 60; // 一个月的秒数
    const oneWeek = 7 * 24 * 60 * 60; // 一周的秒数
    const oneDay = 24 * 60 * 60; // 一天的秒数
    
    if (remainingTime > oneMonth) {
      // 大于一个月：白色
      return 'white';
    } else if (remainingTime > oneWeek) {
      // 大于一周，小于一个月：浅绿色到深绿色（变浅一个度）
      const totalWeeks = oneMonth / (7 * oneDay); // 4周
      const weeksRemaining = remainingTime / (7 * oneDay);
      const ratio = 1 - (weeksRemaining - 1) / (totalWeeks - 1); // 从第1周到第4周
      const intensity = Math.floor(240 - ratio * 80); // 从240到160（变浅）
      return `rgb(100, ${intensity}, 100)`;
    } else if (remainingTime > oneDay) {
      // 一周内：黄色到明黄色（加深一个度，彻底与白色区分）
      const totalDays = 7;
      const daysRemaining = remainingTime / oneDay;
      const ratio = 1 - (daysRemaining - 1) / (totalDays - 1); // 从第1天到第7天
      const intensity = Math.floor(200 - ratio * 80); // 从200到120（加深）
      return `rgb(255, 255, ${intensity})`;
    } else {
      // 一天内：浅红色到大红色（调亮一个度，越临近截止越朝着亮红色变化）
      const totalHours = 24;
      const hoursRemaining = remainingTime / (60 * 60);
      const ratio = 1 - hoursRemaining / totalHours; // 从24小时到0小时
      const redIntensity = Math.floor(255 - ratio * 50); // 从255到205（调亮）
      const otherIntensity = Math.floor(255 - ratio * 200); // 从255到55（更亮红）
      return `rgb(${redIntensity}, ${otherIntensity}, ${otherIntensity})`;
    }
  };

  const isExpired = countdown.remainingTime <= 0;
  const isCompleted = countdown.completed;
  const backgroundColor = !isCompleted && !isExpired ? getBackgroundColor(countdown.remainingTime) : 'white';

  return (
    <div 
      className={`rounded-lg shadow-md p-3 mb-2 border-l-4 ${
        isCompleted ? 'border-green-500 opacity-75' : 
        isExpired ? 'border-red-500' : 'border-blue-500'
      }`}
      style={{ backgroundColor }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 flex-1">
          <input
            type="checkbox"
            checked={isCompleted}
            onChange={() => onToggle(countdown.id)}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <div className="flex-1">
            {/* 事件名单独一行 */}
            <div className="bg-white bg-opacity-90 rounded-lg p-2 mb-3 inline-block">
              <h3 className={`font-semibold text-sm ${
                isCompleted ? 'line-through text-gray-500' : 'text-gray-800'
              }`}>
                {countdown.title}
                {/* 如果已过期且未完成，显示提醒图标 */}
                {isExpired && !isCompleted && (
                  <Bell className="inline-block w-4 h-4 ml-2 text-red-500 animate-pulse" />
                )}
              </h3>
            </div>
            {/* 倒计时单独一行，间隔增大 */}
            <div className="bg-white bg-opacity-90 rounded-lg p-2 inline-block">
              <div className="flex items-center space-x-2">
                <Clock className="w-3 h-3 text-gray-500" />
                <span className={`text-sm ${
                  isCompleted ? 'text-gray-400' :
                  isExpired ? 'text-red-600 font-bold' : 'text-blue-600'
                }`}>
                  {isCompleted ? '已完成' : 
                   isExpired ? '已过期' : 
                   formatTime(countdown.remainingTime)}
                </span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          {/* 重新倒计时按钮 */}
          {isExpired && !isCompleted && (
            <button
              onClick={() => onRestart(countdown.id)}
              className="p-1 text-blue-500 hover:bg-blue-50 rounded-full transition-colors"
              title="重新开始倒计时"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => onDelete(countdown.id)}
            className="p-1 text-red-500 hover:bg-red-50 rounded-full transition-colors"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default CountdownItem;
