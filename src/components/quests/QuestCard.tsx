'use client';

import { EpicQuest } from '@/lib/types';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LIFE_AREAS } from '@/lib/constants';
import { useGame } from '@/contexts/GameContext';

interface QuestCardProps {
  quest: EpicQuest;
}

export const QuestCard: React.FC<QuestCardProps> = ({ quest }) => {
  const { completeMilestone } = useGame();
  const lifeArea = LIFE_AREAS[quest.category];
  
  const progressPercentage = quest.totalMilestones > 0 
    ? Math.round((quest.completedMilestones / quest.totalMilestones) * 100)
    : 0;

  const nextMilestone = quest.milestones.find(m => !m.isCompleted);

  const handleCompleteMilestone = async (milestoneId: string) => {
    try {
      const result = await completeMilestone(quest.id, milestoneId);
      if (result.expGained > 0) {
        console.log(`🎉 Milestone completed! +${result.expGained} EXP earned!`);
      }
    } catch (error) {
      console.error('Failed to complete milestone');
    }
  };

  return (
    <Card className={`
      border-l-4 transition-all duration-200 hover:shadow-lg
      ${quest.isCompleted 
        ? 'bg-green-900/30 border-green-500' 
        : 'bg-gray-700 border-purple-500'
      }
    `}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className={`text-lg text-white ${quest.isCompleted ? 'line-through' : ''}`}>
              {quest.title}
            </CardTitle>
            <div className="flex items-center space-x-2 mt-2">
              <Badge 
                variant="outline" 
                className="text-xs"
                style={{ 
                  backgroundColor: lifeArea.color.replace('bg-', 'rgba(') + ', 0.1)',
                  borderColor: lifeArea.color.replace('bg-', 'rgba(') + ', 0.3)',
                }}
              >
                {lifeArea.icon} {lifeArea.name}
              </Badge>
              {quest.isCompleted && (
                <Badge className="bg-green-600 text-white text-xs">
                  ✅ Completed
                </Badge>
              )}
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm text-gray-400">
              {quest.completedMilestones}/{quest.totalMilestones}
            </div>
            <div className="text-xs text-gray-500">milestones</div>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {/* Description */}
        {quest.description && (
          <p className="text-sm text-gray-400 mb-4">{quest.description}</p>
        )}

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-300">Progress</span>
            <span className="text-sm text-gray-300">{progressPercentage}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        {/* Next Milestone */}
        {!quest.isCompleted && nextMilestone && (
          <div className="bg-gray-800 rounded-lg p-3 mb-3">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <h4 className="text-sm font-medium text-white mb-1">
                  Next Milestone: {nextMilestone.title}
                </h4>
                {nextMilestone.description && (
                  <p className="text-xs text-gray-400 mb-2">{nextMilestone.description}</p>
                )}
                <div className="flex items-center space-x-2 text-xs">
                  <span className="text-yellow-400">⭐</span>
                  <span className="text-gray-300">+{nextMilestone.expReward} EXP</span>
                </div>
              </div>
              <Button
                onClick={() => handleCompleteMilestone(nextMilestone.id)}
                size="sm"
                className="bg-purple-600 hover:bg-purple-700 text-white ml-3"
              >
                Complete
              </Button>
            </div>
          </div>
        )}

        {/* Completed Milestones Preview */}
        {quest.completedMilestones > 0 && (
          <div className="space-y-1">
            <h4 className="text-xs font-medium text-gray-400 mb-2">Recent Completions:</h4>
            {quest.milestones
              .filter(m => m.isCompleted)
              .slice(-2)
              .map(milestone => (
                <div key={milestone.id} className="flex items-center space-x-2 text-xs">
                  <span className="text-green-400">✅</span>
                  <span className="text-gray-300 line-through">{milestone.title}</span>
                  <span className="text-yellow-400">+{milestone.expReward}</span>
                </div>
              ))
            }
          </div>
        )}

        {/* Quest Rewards */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-600">
          <div className="text-xs text-gray-400">
            Quest Reward: <span className="text-yellow-400 font-medium">+{quest.expReward} EXP</span>
          </div>
          {quest.isCompleted && quest.completedDate && (
            <div className="text-xs text-gray-400">
              Completed: {new Date(quest.completedDate).toLocaleDateString()}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};