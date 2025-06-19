
import React from 'react';
import { DayView } from './views/DayView';
import { WeekView } from './views/WeekView';
import { MonthView } from './views/MonthView';
import { NextEventView } from './views/NextEventView';

type ViewMode = 'day' | 'week' | 'month' | 'next';

interface CalendarViewProps {
  viewMode: ViewMode;
  currentTime: Date;
}

export const CalendarView: React.FC<CalendarViewProps> = ({ viewMode, currentTime }) => {
  const renderView = () => {
    switch (viewMode) {
      case 'day':
        return <DayView currentTime={currentTime} />;
      case 'week':
        return <WeekView currentTime={currentTime} />;
      case 'month':
        return <MonthView currentTime={currentTime} />;
      case 'next':
        return <NextEventView currentTime={currentTime} />;
      default:
        return <DayView currentTime={currentTime} />;
    }
  };

  return (
    <div className="p-6">
      {renderView()}
    </div>
  );
};
