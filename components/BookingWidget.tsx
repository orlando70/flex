"use client";

import { Calendar, Users, MessageCircle, Shield, X, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';

type DateRange = {
  start: Date | null;
  end: Date | null;
};

interface BookingWidgetProps {
  property?: any;
}

interface CalendarOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onDateSelect: (dateRange: DateRange) => void;
  value: DateRange;
  buttonRef: React.RefObject<HTMLButtonElement | null>;
}

function CalendarOverlay({ isOpen, onClose, onDateSelect, value, buttonRef }: CalendarOverlayProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [currentDate, setCurrentDate] = useState(new Date());

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Don't close if clicking on the button itself
      if (buttonRef.current && buttonRef.current.contains(event.target as Node)) {
        return;
      }
      
      // Don't close if clicking inside the calendar
      if (overlayRef.current && overlayRef.current.contains(event.target as Node)) {
        return;
      }
      
      // Close if clicking outside both
      onClose();
    };

    const updatePosition = () => {
      if (buttonRef.current && isOpen) {
        const rect = buttonRef.current.getBoundingClientRect();
        const viewportWidth = window.innerWidth;
        const viewportHeight = window.innerHeight;
        
        // Calendar dimensions
        const calendarWidth = 700;
        const calendarHeight = 300; // Approximate height
        
        // Calculate initial position (below the button)
        let left = rect.left;
        let top = rect.bottom + 8;
        
        // Ensure calendar stays within viewport bounds
        if (left + calendarWidth > viewportWidth) {
          left = Math.max(16, viewportWidth - calendarWidth - 16);
        }
        
        if (top + calendarHeight > viewportHeight) {
          // Position above the button if there's not enough space below
          top = Math.max(16, rect.top - calendarHeight - 8);
        }
        
        // Ensure minimum margins
        left = Math.max(16, left);
        top = Math.max(16, top);
        
        setPosition({ top, left });
      }
    };

    if (isOpen) {
      // Use a small delay to ensure the button state is fully updated
      const timer = setTimeout(updatePosition, 10);
      
      document.addEventListener('mousedown', handleClickOutside);
      window.addEventListener('scroll', updatePosition);
      window.addEventListener('resize', updatePosition);
      
      return () => {
        clearTimeout(timer);
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updatePosition);
        window.removeEventListener('resize', updatePosition);
      };
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', updatePosition);
      window.removeEventListener('resize', updatePosition);
    };
  }, [isOpen, onClose, buttonRef]);

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const dayNames = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'];

  const getDaysInMonth = (year: number, month: number) => {
    return new Date(year, month + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (year: number, month: number) => {
    return new Date(year, month, 1).getDay();
  };

  const isDateInRange = (date: Date) => {
    if (!value.start || !value.end) return false;
    return date >= value.start && date <= value.end;
  };

  const isDateRangeStart = (date: Date) => {
    if (!value.start) return false;
    return date.toDateString() === value.start.toDateString();
  };

  const isDateRangeEnd = (date: Date) => {
    if (!value.end) return false;
    return date.toDateString() === value.end.toDateString();
  };

  const isToday = (date: Date) => {
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  const isPastDate = (date: Date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  };

  const handleDateClick = (date: Date) => {
    if (isPastDate(date)) return;

    if (!value.start || (value.start && value.end)) {
      // Start new selection
      onDateSelect({ start: date, end: null });
    } else if (value.start && !value.end) {
      // Complete the range
      if (date >= value.start) {
        onDateSelect({ start: value.start, end: date });
        setTimeout(() => onClose(), 300);
      } else {
        // Start new selection if clicked date is before start
        onDateSelect({ start: date, end: null });
      }
    }
  };

  const renderCalendarMonth = (monthOffset: number) => {
    const displayDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + monthOffset, 1);
    const year = displayDate.getFullYear();
    const month = displayDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    
    const days = [];
    
    // Add empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="w-10 h-10"></div>
      );
    }
    
    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const isDisabled = isPastDate(date);
      const isSelected = isDateRangeStart(date) || isDateRangeEnd(date);
      const isInRange = isDateInRange(date);
      const isTodayDate = isToday(date);
      
      days.push(
        <button
          key={day}
          onClick={() => handleDateClick(date)}
          disabled={isDisabled}
          className={`
            w-10 h-10 rounded-lg text-sm font-medium transition-colors
            ${isDisabled 
              ? 'text-gray-300 cursor-not-allowed' 
              : 'text-gray-700 hover:bg-gray-100 cursor-pointer'
            }
            ${isSelected 
              ? 'bg-blue-600 text-white hover:bg-blue-700' 
              : ''
            }
            ${isInRange && !isSelected 
              ? 'bg-blue-100 text-blue-600' 
              : ''
            }
            ${isTodayDate && !isSelected 
              ? 'bg-gray-200 font-semibold' 
              : ''
            }
          `}
        >
          {day}
        </button>
      );
    }
    
    return (
      <div className="flex-1 px-4">
        <div className="text-center font-semibold text-gray-900 mb-4">
          {monthNames[month]} {year}
        </div>
        
        {/* Day headers */}
        <div className="grid grid-cols-7 gap-1 mb-2">
          {dayNames.map(day => (
            <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
              {day}
            </div>
          ))}
        </div>
        
        {/* Calendar grid */}
        <div className="grid grid-cols-7 gap-1">
          {days}
        </div>
      </div>
    );
  };

  const goToPreviousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  };

  const goToNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
  };

  console.log('CalendarOverlay render - isOpen:', isOpen, 'position:', position);
  
  if (!isOpen) return null;

  return (
    <div 
      ref={overlayRef} 
      className="fixed bg-white rounded-lg shadow-xl border z-[9999]"
      style={{
        top: position.top,
        left: position.left,
        minWidth: '700px',
        maxWidth: '700px'
      }}
    >
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Select dates</h3>
            <p className="text-gray-600 text-sm mt-1">Add your travel dates for exact pricing</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>
        
        {/* Navigation */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={goToPreviousMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft size={20} className="text-gray-600" />
          </button>
          
          <button
            onClick={goToNextMonth}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronRight size={20} className="text-gray-600" />
          </button>
        </div>
        
        {/* Two month view */}
        <div className="flex gap-8">
          {renderCalendarMonth(0)}
          {renderCalendarMonth(1)}
        </div>
      </div>
    </div>
  );
}

export default function BookingWidget({ property }: BookingWidgetProps) {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [dateRange, setDateRange] = useState<DateRange>({ start: null, end: null });
  const dateButtonRef = useRef<HTMLButtonElement>(null);

  const handleDateSelect = (newDateRange: DateRange) => {
    setDateRange(newDateRange);
  };

  const formatDateRange = () => {
    if (!dateRange.start) return "Select dates";
    
    if (dateRange.start && dateRange.end) {
      return `${dateRange.start.toLocaleDateString('en-GB')} - ${dateRange.end.toLocaleDateString('en-GB')}`;
    } else if (dateRange.start) {
      return dateRange.start.toLocaleDateString('en-GB');
    }
    
    return "Select dates";
  };

  const calculateTotalPrice = () => {
    if (!dateRange.start || !dateRange.end || !property?.price) return null;
    
    const nights = Math.ceil((dateRange.end.getTime() - dateRange.start.getTime()) / (1000 * 60 * 60 * 24));
    return nights * property.price;
  };

  const totalPrice = calculateTotalPrice();

  return (
    <div className="relative">
      <div className="bg-white rounded-2xl shadow-lg w-full max-w-sm overflow-hidden">
        {/* Header */}
        <div className="bg-background p-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold text-white">Book your stay</h2>
              <p className="text-teal-100 text-sm mt-1">Select dates to see the total price</p>
            </div>
          </div>
        </div>

        <div className="p-5">
          {/* Date and Guest Selection Row */}
          <div className="flex gap-3 mb-5">
            <button 
              ref={dateButtonRef}
              onClick={(e) => {
                e.stopPropagation();
                const newState = !isCalendarOpen;
                console.log('Calendar button clicked, setting state to:', newState);
                setIsCalendarOpen(newState);
              }}
              className={`flex-1 bg-gray-100 rounded-lg px-3 py-3 text-left flex items-center text-gray-600 hover:bg-gray-200 transition-colors ${isCalendarOpen ? 'ring-2 ring-teal-500' : ''}`}
            >
              <Calendar size={16} className="mr-2" />
              <span className="text-sm">{formatDateRange()}</span>
            </button>
            
            <button className="bg-gray-100 rounded-lg px-3 py-3 flex w-[120px] items-center justify-between text-gray-600 hover:bg-gray-200 transition-colors">
              <span className="flex items-center">
                <Users size={16} className="mr-2" />
                <span className="text-sm">1</span>
              </span>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>

          {/* Total Price Display */}
          {totalPrice && (
            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Total price</span>
                <span className="text-lg font-semibold text-gray-900">£{totalPrice}</span>
              </div>
            </div>
          )}

          {/* Check Availability Button */}
          <button className="text-sm w-full bg-background/50 text-white py-3 rounded font-medium transition-colors flex items-center justify-center mb-4">
            <Calendar size={16} className="mr-2" />
            Check availability
          </button>

          {/* Send Inquiry */}
          <button className="text-sm w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center mb-2">
            <MessageCircle size={16} className="mr-2" />
            Send Inquiry
          </button>

          {/* Instant Confirmation */}
          <div className="flex items-center justify-center text-sm text-gray-600">
            <Shield size={12} className="mr-2" />
            <span>Instant confirmation</span>
          </div>
        </div>
      </div>

      <CalendarOverlay
        isOpen={isCalendarOpen}
        onClose={() => setIsCalendarOpen(false)}
        onDateSelect={handleDateSelect}
        value={dateRange}
        buttonRef={dateButtonRef}
      />
    </div>
  );
}