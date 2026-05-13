import CountdownForm from '../components/CountdownForm';
import { ListChecks, Search, Filter, Clock } from 'lucide-react';
import React, { useMemo, useState } from 'react';
import CountdownItem from '../components/CountdownItem';
import useCountdowns from '../hooks/useCountdowns';

const Index = () => {
  const { countdowns, addCountdown, toggleCountdown, restartCountdown, deleteCountdown } = useCountdowns();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all'); // all, withinDay, withinWeek, withinMonth, beyondMonth
  const [activeTab, setActiveTab] = useState('active'); // active, completed

  const activeCountdowns = countdowns.filter((c) => !c.completed);
  const completedCountdowns = countdowns.filter((c) => c.completed);

  // 根据搜索词和分类筛选倒计时
  const filteredCountdowns = useMemo(() => {
    const oneMonth = 30 * 24 * 60 * 60 * 1000; // 一个月的毫秒数
    const oneWeek = 7 * 24 * 60 * 60 * 1000; // 一周的毫秒数
    const oneDay = 24 * 60 * 60 * 1000; // 一天的毫秒数
    const now = Date.now();

    return countdowns.filter((countdown) => {
      // 搜索过滤
      const matchesSearch = countdown.title.toLowerCase().includes(searchTerm.toLowerCase());

      // 分类过滤
      let matchesCategory = true;
      if (filterCategory !== 'all') {
        const remainingTime = countdown.targetTime - now;

        switch (filterCategory) {
          case 'withinDay':
            matchesCategory = remainingTime <= oneDay && remainingTime > 0;
            break;
          case 'withinWeek':
            matchesCategory = remainingTime <= oneWeek && remainingTime > oneDay;
            break;
          case 'withinMonth':
            matchesCategory = remainingTime <= oneMonth && remainingTime > oneWeek;
            break;
          case 'beyondMonth':
            matchesCategory = remainingTime > oneMonth;
            break;
          default:
            matchesCategory = true;
        }
      }

      return matchesSearch && matchesCategory;
    });
  }, [countdowns, searchTerm, filterCategory]);

  const filteredActiveCountdowns = filteredCountdowns.filter((c) => !c.completed);
  const filteredCompletedCountdowns = filteredCountdowns.filter((c) => c.completed);

  const filterOptions = [
  { value: 'all', label: '全部' },
  { value: 'withinDay', label: '一天内' },
  { value: 'withinWeek', label: '一周内' },
  { value: 'withinMonth', label: '一个月内' },
  { value: 'beyondMonth', label: '一个月以外' }];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-6">
      <div className="max-w-6xl mx-auto px-4">
        {/* 页面标题 */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-3 mb-3">
            <Clock className="w-8 h-8 text-blue-600" />
            <h1 className="text-3xl font-bold text-gray-800">智能倒计时</h1>
          </div>
          <p className="text-base text-gray-600">
            管理您的重要事件，让时间更有意义
          </p>
        </div>

        {/* 搜索和筛选 */}
        <div className="bg-white rounded-lg shadow-md p-3 mb-4">
          <div className="flex flex-col md:flex-row gap-3">
            {/* 搜索框 */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="搜索事件倒计时..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
              
            </div>
            
            {/* 分类筛选 */}
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                
                {filterOptions.map((option) =>
                <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                )}
              </select>
            </div>
          </div>
        </div>

        {/* 统计信息 */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
          <div />
          <div />
        </div>

        {/* 并排摆放：添加倒计时表单和进行中的倒计时 */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 添加倒计时表单 */}
          <div>
            <CountdownForm onAddCountdown={addCountdown} />
          </div>

          {/* 进行中的倒计时 */}
          <div>
            {/* 分类选项卡 */}
            <div className="flex mb-3 bg-white rounded-lg shadow-md p-1">
              <button
                onClick={() => setActiveTab('active')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'active' ?
                'bg-blue-100 text-blue-700' :
                'text-gray-500 hover:text-gray-700'}`
                }>
                进行中的倒计时
              </button>
              <button
                onClick={() => setActiveTab('expired')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'expired' ?
                'bg-red-100 text-red-700' :
                'text-gray-500 hover:text-gray-700'}`
                }>
                已过期的倒计时
              </button>
              <button
                onClick={() => setActiveTab('completed')}
                className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'completed' ?
                'bg-green-100 text-green-700' :
                'text-gray-500 hover:text-gray-700'}`
                }>
                已完成的倒计时
              </button>
            </div>

            {/* 根据选项卡显示内容 */}
            {activeTab === 'active' &&
            <>
                {filteredActiveCountdowns.length > 0 &&
              <div>
                    <div className="space-y-2">
                      {filteredActiveCountdowns.map((countdown) =>
                  <CountdownItem
                    key={countdown.id}
                    countdown={countdown}
                    onToggle={toggleCountdown}
                    onRestart={restartCountdown}
                    onDelete={deleteCountdown} />

                  )}
                    </div>
                  </div>
              }

                {/* 空状态 */}
                {filteredActiveCountdowns.length === 0 &&
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      {searchTerm || filterCategory !== 'all' ? '没有找到匹配的倒计时' : '还没有倒计时'}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      {searchTerm || filterCategory !== 'all' ? '尝试调整搜索条件或筛选选项' : '添加您的第一个倒计时事件，开始管理时间吧！'}
                    </p>
                  </div>
              }
              </>
            }

            {activeTab === 'expired' &&
            <>
                {filteredActiveCountdowns.filter(c => c.remainingTime <= 0).length > 0 &&
              <div>
                    <div className="space-y-2">
                      {filteredActiveCountdowns.filter(c => c.remainingTime <= 0).map((countdown) =>
                  <CountdownItem
                    key={countdown.id}
                    countdown={countdown}
                    onToggle={toggleCountdown}
                    onRestart={restartCountdown}
                    onDelete={deleteCountdown} />

                  )}
                    </div>
                  </div>
              }

                {/* 空状态 */}
                {filteredActiveCountdowns.filter(c => c.remainingTime <= 0).length === 0 &&
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <Clock className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      还没有已过期的倒计时
                    </h3>
                    <p className="text-gray-500 text-sm">
                      已过期的倒计时事件会显示在这里
                    </p>
                  </div>
              }
              </>
            }

            {activeTab === 'completed' &&
            <>
                {filteredCompletedCountdowns.length > 0 &&
              <div>
                    <div className="space-y-2">
                      {filteredCompletedCountdowns.map((countdown) =>
                  <CountdownItem
                    key={countdown.id}
                    countdown={countdown}
                    onToggle={toggleCountdown}
                    onRestart={restartCountdown}
                    onDelete={deleteCountdown} />

                  )}
                    </div>
                  </div>
              }

                {/* 空状态 */}
                {filteredCompletedCountdowns.length === 0 &&
              <div className="text-center py-8 bg-white rounded-lg shadow-md">
                    <ListChecks className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <h3 className="text-lg font-semibold text-gray-600 mb-2">
                      还没有已完成的倒计时
                    </h3>
                    <p className="text-gray-500 text-sm">
                      完成一些倒计时事件后，它们会显示在这里
                    </p>
                  </div>
              }
              </>
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
