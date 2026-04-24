import './LeafOrnament.css';

export default function LeafOrnament({ 
  className = '', 
  size = 'medium', 
  opacity = 0.85, 
  rotation = 0,
  style = {},
  ...props
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
      viewBox="0 0 100 100"
      style={{ 
        opacity, 
        transform: `rotate(${rotation}deg)`,
        ...style
      }}
      aria-hidden="true"
      {...props}
    >
      <path 
        d="M50 5C65 5 80 20 85 45C90 70 70 95 50 95C30 95 10 70 15 45C20 20 35 5 50 5Z" 
        fill="#a67c52" 
      />
      <path 
        d="M50 5V95" 
        stroke="#87603c" 
        strokeWidth="2" 
        fill="none" 
      />
      <path 
        d="M50 30L65 20 M50 50L70 40 M50 70L65 60 M50 30L35 20 M50 50L30 40 M50 70L35 60" 
        stroke="#87603c" 
        strokeWidth="1.5" 
        fill="none" 
      />
    </svg>
  );
}
