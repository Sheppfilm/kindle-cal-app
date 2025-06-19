
import React from 'react';

interface MonthViewProps {
  currentTime: Date;
}

export const MonthView: React.FC<MonthViewProps> = ({ currentTime }) => {
  const getMonthDays = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    
    // Add empty cells for days before month starts
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    
    // Add all days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(new Date(year, month, day));
    }
    
    return days;
  };

  const monthDays = getMonthDays(currentTime);
  const weekDays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];

  // Mock monthly events
  const mockEvents = [5, 12, 18, 25]; // Days with events

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 tracking-tight">
        {currentTime.toLocaleDateString('en-US', { 
          month: 'long', 
          year: 'numeric' 
        }).toUpperCase()}
      </h2>
      
      <div className="border-2 border-black">
        {/* Week day headers */}
        <div className="grid grid-cols-7 gap-0">
          {weekDays.map((day) => (
            <div key={day} className="p-3 border-r border-b border-black bg-black text-white text-center font-bold text-sm last:border-r-0">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar days */}
        <div className="grid grid-cols-7 gap-0">
          {monthDays.map((day, index) => (
            <div 
              key={index} 
              className="h-20 border-r border-b border-black p-2 last:border-r-0"
            >
              {day && (
                <>
                  <div className="font-bold text-sm mb-1">
                    {day.getDate()}
                  </div>
                  {mockEvents.includes(day.getDate()) && (
                    <div className="w-2 h-2 bg-black"></div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
