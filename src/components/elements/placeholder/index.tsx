interface PlaceholderProps {
  className?: string;
}

export default function Placeholder({ className = "" }: PlaceholderProps) {
  return (
    <div className={`animate-pulse ${className}`}>
      <div className="w-full h-64 bg-gray-300 rounded-lg mb-4"></div>
      <div className="h-4 bg-gray-300 rounded mb-2"></div>
      <div className="h-3 bg-gray-300 rounded w-3/4"></div>
    </div>
  );
}
