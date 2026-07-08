export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex flex-col items-start ${className}`}>
      <div className="flex items-center gap-2">
        <svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="flex-shrink-0"
        >
          {/* Book */}
          <rect x="10" y="20" width="35" height="60" rx="4" fill="#2563EB" />
          <rect x="15" y="35" width="20" height="4" rx="2" fill="#93C5FD" />
          <rect x="15" y="45" width="20" height="4" rx="2" fill="#93C5FD" />
          <rect x="15" y="55" width="20" height="4" rx="2" fill="#93C5FD" />
          <path
            d="M10 24C10 21.7909 11.7909 20 14 20H18V80H14C11.7909 80 10 78.2091 10 76V24Z"
            fill="#1D4ED8"
          />

          {/* Link Chain Green */}
          <path
            d="M45 40C45 31.7157 51.7157 25 60 25H70C78.2843 25 85 31.7157 85 40C85 48.2843 78.2843 55 70 55H65"
            stroke="#10B981"
            strokeWidth="8"
            strokeLinecap="round"
          />

          <circle cx="55" cy="40" r="6" fill="#F9FAFB" />

          {/* Link Chain Orange */}
          <path
            d="M85 60C85 68.2843 78.2843 75 70 75H60C51.7157 75 45 68.2843 45 60C45 51.7157 51.7157 45 60 45H65"
            stroke="#F59E0B"
            strokeWidth="8"
            strokeLinecap="round"
          />

          <circle cx="75" cy="60" r="6" fill="#F9FAFB" />

          {/* Center Dot */}
          <circle cx="65" cy="50" r="8" fill="#2563EB" />
        </svg>
        <div className="flex items-baseline">
          <span className="text-2xl font-display font-bold text-brand-blue tracking-tight">
            edu
          </span>
          <span className="text-2xl font-display font-bold text-brand-ink dark:text-white tracking-tight">
            link
          </span>
        </div>
      </div>
      <span className="text-[9px] font-semibold tracking-[0.2em] text-gray-500 dark:text-gray-400 ml-12 uppercase">
        Learn · Connect · Grow
      </span>
    </div>
  );
}
