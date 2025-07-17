import React, { useState, useEffect } from 'react'
import { supabase } from './lib/supabase'
import GroupLeaderboard from './components/GroupLeaderboard'
import PersonalLeaderboard from './components/PersonalLeaderboard'
import { RefreshCw, Activity } from 'lucide-react'

function App() {
  const [users, setUsers] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)


  const fetchData = async () => {
    setLoading(true)
    try {
      // 실제 Supabase 데이터 가져오기 (role이 student인 사용자만)
      const { data: userData, error: userError } = await supabase
        .from('users')
        .select('*')
        .eq('role', 'student')
      
      if (userError) {
        console.error('Supabase 에러:', userError)
        // 에러 발생시 데모 데이터 사용
        console.log('데모 데이터를 사용합니다.')
        setUsers(demoUsers)
      } else {
        console.log('Supabase에서 데이터를 가져왔습니다:', userData)
        setUsers(userData || [])
      }
      
      // 조별 데이터 계산 (실제 데이터 또는 데모 데이터)
      const dataToUse = userData && !userError ? userData : demoUsers
      const groupData = dataToUse.reduce((acc, user) => {
        const groupName = user.group || user.group_name || 'Unknown'
        if (!acc[groupName]) {
          acc[groupName] = {
            group_name: groupName,
            total_talent: 0,
            member_count: 0
          }
        }
        acc[groupName].total_talent += user.max_talent || 0
        acc[groupName].member_count += 1
        return acc
      }, {})
      
      const sortedGroups = Object.values(groupData)
        .sort((a, b) => b.total_talent - a.total_talent)
      
      setGroups(sortedGroups)
      setLastUpdated(new Date())
    } catch (error) {
      console.error('데이터 가져오기 실패:', error)
      // 에러 발생시 데모 데이터 사용
      setUsers(demoUsers)
      
      const groupData = demoUsers.reduce((acc, user) => {
        if (!acc[user.group]) {
          acc[user.group] = {
            group_name: user.group,
            total_talent: 0,
            member_count: 0
          }
        }
        acc[user.group].total_talent += user.max_talent
        acc[user.group].member_count += 1
        return acc
      }, {})
      
      const sortedGroups = Object.values(groupData)
        .sort((a, b) => b.total_talent - a.total_talent)
      
      setGroups(sortedGroups)
      setLastUpdated(new Date())
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    // 30초마다 데이터 새로고침
    const interval = setInterval(fetchData, 120000)
    return () => clearInterval(interval)
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="glass-effect rounded-2xl p-8 text-center">
          <RefreshCw className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-white text-lg">데이터를 불러오는 중...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen p-6">
      {/* 로고 배너 */}
      <div className="w-full flex justify-center items-center mb-8 mt-2">
        <img
          src="/logo.png"
          alt="Level Up Dashboard Logo"
          className="h-32 w-auto drop-shadow-lg"
          style={{ maxHeight: '120px' }}
        />
      </div>
      <div className="max-w-7xl mx-auto">
        {/* 헤더 */}
        <div className="text-center mb-8">
          <h1 className="text-5xl font-bold text-white mb-4">
            🏆 'Level Up' 리더 보드! 🏆
          </h1>
          <div className="flex items-center justify-center gap-4 text-gray-300">
            <Activity className="w-5 h-5" />
            <span>실시간 업데이트</span>
            {lastUpdated && (
              <span className="text-sm">
                마지막 업데이트: {lastUpdated.toLocaleTimeString()}
              </span>
            )}
            <button
              onClick={fetchData}
              className="ml-4 glass-effect rounded-lg px-4 py-2 hover:bg-white/20 
                       transition-all duration-300 flex items-center gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              새로고침
            </button>
          </div>
        </div>

        {/* 메인 콘텐츠 */}
        <div className="grid grid-cols-2 gap-8 h-[calc(100vh-200px)]">
          {/* 좌측: 조별 순위 */}
          <div className="glass-effect rounded-3xl p-8">
            <GroupLeaderboard groups={groups} users={users} />
          </div>

          {/* 우측: 개인 순위 */}
          <div className="glass-effect rounded-3xl p-8">
            <PersonalLeaderboard users={users} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default App