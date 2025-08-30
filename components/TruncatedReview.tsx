import { useState } from 'react';

interface TruncatedReviewProps {
  children: React.ReactNode;
  maxLength?: number;
  className?: string;
}

const TruncatedReview = ({ children, maxLength = 200, className = '' }: TruncatedReviewProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Convert children to string for truncation
  const text = typeof children === 'string' ? children : String(children);
  
  const shouldTruncate = text.length > maxLength;
  const displayText = isExpanded ? text : text.slice(0, maxLength) + (shouldTruncate ? '...' : '');
  
  if (!shouldTruncate) {
    return <div className={className}>{text}</div>;
  }
  
  return (
    <div className={className}>
      <div className="mb-2">{displayText}</div>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 rounded"
      >
        {isExpanded ? 'Read Less' : 'Read More'}
      </button>
    </div>
  );
};

export default TruncatedReview;
