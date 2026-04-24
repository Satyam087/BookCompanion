import './LeafOrnament.css';

export default function LeafOrnament({ 
  className = '', 
  size = 'medium', 
  color = '#8A6A4A', 
  opacity = 0.12, 
  rotation = 0 
}) {
  
  const sizeMap = {
    tiny: 24,
    small: 40,
    medium: 70,
    large: 140
  };

  const pxSize = sizeMap[size] || sizeMap.medium;

  return (
    <svg 
      className={`leaf-ornament ${className}`}
      width={pxSize} 
      height={pxSize} 
      viewBox="0 0 24 24" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      style={{ 
        opacity, 
        transform: `rotate(${rotation}deg)` 
      }}
      aria-hidden="true"
    >
      <path 
        d="M12 2C7 2 3 6 3 11C3 15 6.5 18.5 11 19.5V22H13V19.5C17.5 18.5 21 15 21 11C21 6 17 2 12 2ZM12 17C8.13 17 5 13.87 5 10C5 7.13 7.13 5 10 5C13.87 5 17 8.13 17 12C17 14.87 14.87 17 12 17Z" 
        fill={color} 
      />
      <path 
        d="M11 7H13V15H11V7Z" 
        fill={color} 
      />
      <path 
        d="M13 11L16 8L17.5 9.5L14.5 12.5L13 11Z" 
        fill={color} 
      />
      <path 
        d="M11 11L8 8L6.5 9.5L9.5 12.5L11 11Z" 
        fill={color} 
      />
    </svg>
  );
}
