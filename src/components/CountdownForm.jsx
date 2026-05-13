import { Plus, Calendar, Clock } from 'lucide-react';
import React, { useState } from 'react';
const CountdownForm = ({ onAddCountdown }) => {
  const [title, setTitle] = useState('');
  const [timeValue, setTimeValue] = useState('');
  const [timeUnit, setTimeUnit] = useState('minutes');
  const [targetDate, setTargetDate] = useState('');
  const [targetTime, setTargetTime] = useState('');

  const timeUnits = [
    { value: 'seconds', label: '秒' },
    { value: 'minutes', label: '分钟' },
    { value: 'hours', label: '小时' },
    { value: 'days', label: '天' },
    { value: 'weeks', label: '周' },
    { value: 'years', label: '年' }
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      alert('请填写事件标题');
      return;
    }

    let targetDateTime;
    const now = new Date();

    // 处理自定义时间输入
    if (timeValue) {
      const value = parseInt(timeValue);
      let milliseconds = 0;
      
      switch (timeUnit) {
        case 'seconds':
          milliseconds = value * 1000;
          break;
        case 'minutes':
          milliseconds = value * 60 * 1000;
          break;
        case 'hours':
          milliseconds = value * 60 * 60 * 1000;
          break;
        case 'days':
          milliseconds = value * 24 * 60 * 60 * 1000;
          break;
        case 'weeks':
          milliseconds = value * 7 * 24 * 60 * 60 * 1000;
          break;
        case 'years':
          milliseconds = value * 365 * 24 * 60 * 60 * 1000;
          break;
        default:
          milliseconds = value * 60 * 1000;
      }
      
      targetDateTime = new Date(now.getTime() + milliseconds);
    }
    // 处理日期时间选择
    else if (targetDate) {
      const dateTimeString = targetTime ? `${targetDate}T${targetTime}:00` : `${targetDate}T23:59:59`;
      targetDateTime = new Date(dateTimeString);
      
      if (targetDateTime <= now) {
        alert('目标时间必须晚于当前时间');
        return;
      }
    } else {
      alert('请输入时间或选择日期');
      return;
    }

    const newCountdown = {
      id: Date.now(),
      title: title.trim(),
      targetTime: targetDateTime.getTime(),
      remainingTime: Math.floor((targetDateTime.getTime() - now.getTime()) / 1000),
      completed: false,
      createdAt: now.getTime()
    };

    onAddCountdown(newCountdown);
    
    // 重置表单
    setTitle('');
    setTimeValue('');
    setTimeUnit('minutes');
    setTargetDate('');
    setTargetTime('');
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
      <div className="flex items-center space-x-2 mb-4">
        <Calendar className="w-6 h-6 text-blue-600" />
        <h2 className="text-xl font-bold text-gray-800">添加新倒计时</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            事件标题
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="开始设置一个待完成事件的倒计时吧~"
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
        
        {/* 时间设置并排摆放 */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* 自定义时间输入 */}
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              自定义时间
            </label>
            <div className="flex space-x-2">
              <input
                type="number"
                value={timeValue}
                onChange={(e) => setTimeValue(e.target.value)}
                placeholder="数值"
                min="1"
                className="w-20 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <select
                value={timeUnit}
                onChange={(e) => setTimeUnit(e.target.value)}
                className="flex-1 px-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {timeUnits.map(unit => (
                  <option key={unit.value} value={unit.value}>
                    {unit.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* 日期时间选择 */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              指定日期时间
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <input
                  type="date"
                  value={targetDate}
                  onChange={(e) => setTargetDate(e.target.value)}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <input
                  type="time"
                  value={targetTime}
                  onChange={(e) => setTargetTime(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-center"
                />
              </div>
            </div>
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 font-medium"
        >
          <Plus className="w-5 h-5" />
          <span>添加倒计时</span>
        </button>
      </form>
    </div>
  );
};

export default CountdownForm;
