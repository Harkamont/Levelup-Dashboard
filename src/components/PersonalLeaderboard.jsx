import React from 'react'
import { User, Award, Zap } from 'lucide-react'
import { getLevelFromTalent, getLevelColor, getLevelName, getLevelRange } from '../utils/levelSystem'

const PersonalLeaderboard = ({ users }) => {
  // 사용자를 레벨별로 그룹화
  const usersByLevel = users.reduce((acc, user) => {
    const level = getLevelFromTalent(user.max_talent)
    if (!acc[level]) acc[level] = []
    acc[level].push(user)
    return acc
  }, {})

  // 레벨을 내림차순으로 정렬
  const sortedLevels = Object.keys(usersByLevel)
    .map(Number)
    .sort((a, b) => b - a)

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <User className="w-8 h-8 text-purple-400" />
        <h2 className="text-3xl font-bold text-white">개인 순위</h2>
      </div>
      
      <div className="flex-1 space-y-6 overflow-y-auto">
        {sortedLevels.map(level => {
          const levelUsers = usersByLevel[level].sort((a, b) => b.max_talent - a.max_talent)
          const { min, max } = getLevelRange(level)
          
          return (
            <div key={level} className="space-y-3">
              <div className={`glass-effect rounded-xl p-4 bg-gradient-to-r ${getLevelColor(level)}`}>
                <div className="flex items-center gap-3">
                  <Award className="w-6 h-6 text-white" />
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      레벨 {level} - {getLevelName(level)}
                    </h3>
                    <p className="text-sm text-white/80">
                      {min.toLocaleString()} - {max.toLocaleString()} 점
                    </p>
                  </div>
                  <div className="ml-auto bg-white/20 rounded-full px-3 py-1">
                    <span className="text-white font-semibold">{levelUsers.length}명</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-2">
                {levelUsers.map((user, index) => (
                  <div
                    key={user.id}
                    className="glass-effect rounded-lg p-4 hover:bg-white/20 transition-all duration-300
                             transform hover:scale-102"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${getLevelColor(level)} 
                                     flex items-center justify-center`}>
                        <span className="text-white font-bold text-sm">
                          {index + 1}
                        </span>
                      </div>
                      <div>
                        <h4 className="font-semibold text-white">{user.name}</h4>
                        <p className="text-sm text-gray-300">{user.group}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default PersonalLeaderboard