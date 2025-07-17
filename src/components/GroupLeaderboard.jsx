import React from 'react'
import { Trophy, Users, Star } from 'lucide-react'

const GROUP_COLORS = [
  'bg-blue-500',
  'bg-green-500',
  'bg-orange-500',
  'bg-purple-500',
  'bg-red-500',
]

function getRandomizedColors(count) {
  // Shuffle and pick colors for the number of groups
  const shuffled = [...GROUP_COLORS].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, count)
}

const GroupLeaderboard = ({ groups, users }) => {
  // 상위 5개 조를 선택한 후 랜덤하게 배치 (점수 순서 숨김)
  const topGroups = [...groups].slice(0, 5)
  const shuffledGroups = [...topGroups].sort(() => Math.random() - 0.5)
  const groupColors = getRandomizedColors(shuffledGroups.length)
  
  // 조별 멤버 목록 가져오기
  const getGroupMembers = (groupName) => {
    return users.filter(user => user.group === groupName)
  }

  // 퍼즐 조각 아이콘과 블루/오렌지 테마
  const getRankIcon = () => {
    return <Star className="w-6 h-6 text-white" />
  }

  const getRankBg = (index) => {
    const colors = [
      'from-puzzle-blue to-puzzle-blue-dark',
      'from-puzzle-orange to-puzzle-orange-dark',
      'from-puzzle-blue to-puzzle-orange',
      'from-puzzle-orange to-puzzle-blue',
      'from-puzzle-blue-dark to-puzzle-orange-dark'
    ]
    return colors[index % colors.length]
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <Users className="w-8 h-8 text-white animate-puzzle-bounce" />
        <h2 className="text-3xl font-bold text-white">TOP 5 조</h2>
      </div>
      
      <div className="flex-1 space-y-4">
        {shuffledGroups.map((group, index) => {
          const members = getGroupMembers(group.group_name)
          const cardColor = groupColors[index % groupColors.length]
          return (
            <div
              key={group.group_name}
              className={`puzzle-card glass-effect rounded-2xl p-6 border ${cardColor} \
                         transform hover:scale-105 transition-all duration-500 animate-slide-in puzzle-shadow\n                         group cursor-pointer overflow-hidden`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-center justify-between relative z-10">
                <div className="flex items-center gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-white/20 backdrop-blur-sm">
                    {getRankIcon()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white drop-shadow-lg">{group.group_name}</h3>
                    <p className="text-sm text-white/80">팀 멤버 {group.member_count}명</p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-white drop-shadow-lg">
                    TOP 5
                  </div>
                  <div className="text-sm text-white/80">상위권 진입</div>
                </div>
              </div>
              
              <div className="mt-4 bg-white/20 rounded-full h-3 relative z-10">
                <div 
                  className="h-full rounded-full bg-gradient-to-r from-white/60 to-white/40 animate-pulse-slow"
                  style={{ width: '85%' }}
                />
              </div>
              
              {/* 호버 시 나타나는 조원 목록 */}
              <div className="mt-4 max-h-0 group-hover:max-h-96 overflow-hidden transition-all duration-500 ease-in-out relative z-10">
                <div className="pt-2 border-t border-white/20">
                  <h4 className="text-sm font-semibold text-white/90 mb-3">👥 조원 목록</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {members.map((member, memberIndex) => (
                      <div
                        key={member.id}
                        className="bg-white/10 rounded-lg p-2 backdrop-blur-sm transform translate-y-4 
                                 group-hover:translate-y-0 transition-all duration-300"
                        style={{ transitionDelay: `${memberIndex * 50}ms` }}
                      >
                        <div className="text-sm font-medium text-white">{member.name}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default GroupLeaderboard