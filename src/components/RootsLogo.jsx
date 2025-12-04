const RootsLogo = ({ width = 40, height = 40, className = '' }) => {
  return (
    <svg 
      width={width} 
      height={height} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Tree/Family icon with roots */}
      <g fill="#0d7377">
        {/* Top circles representing family members */}
        <circle cx="35" cy="25" r="8" />
        <circle cx="50" cy="18" r="8" />
        <circle cx="65" cy="25" r="8" />
        
        {/* Central trunk/body */}
        <path d="M 50 30 Q 45 40, 50 50 Q 55 40, 50 30 Z" />
        
        {/* Arms/branches */}
        <path d="M 45 38 Q 35 40, 30 45" strokeWidth="3" stroke="#0d7377" fill="none" strokeLinecap="round"/>
        <path d="M 55 38 Q 65 40, 70 45" strokeWidth="3" stroke="#0d7377" fill="none" strokeLinecap="round"/>
        
        {/* Leaves on branches */}
        <ellipse cx="28" cy="46" rx="5" ry="7" transform="rotate(-30 28 46)" />
        <ellipse cx="72" cy="46" rx="5" ry="7" transform="rotate(30 72 46)" />
        
        {/* Root system */}
        <path d="M 50 50 L 50 60" strokeWidth="4" stroke="#0d7377" strokeLinecap="round"/>
        <path d="M 50 60 Q 40 65, 35 75" strokeWidth="3" stroke="#0d7377" fill="none" strokeLinecap="round"/>
        <path d="M 50 60 Q 45 70, 42 80" strokeWidth="3" stroke="#0d7377" fill="none" strokeLinecap="round"/>
        <path d="M 50 60 Q 55 70, 58 80" strokeWidth="3" stroke="#0d7377" fill="none" strokeLinecap="round"/>
        <path d="M 50 60 Q 60 65, 65 75" strokeWidth="3" stroke="#0d7377" fill="none" strokeLinecap="round"/>
        
        {/* Small root leaves */}
        <ellipse cx="34" cy="76" rx="4" ry="6" transform="rotate(-20 34 76)" />
        <ellipse cx="66" cy="76" rx="4" ry="6" transform="rotate(20 66 76)" />
      </g>
    </svg>
  );
};

export default RootsLogo;
