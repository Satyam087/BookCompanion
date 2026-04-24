import leafImg from '../assets/leaf.png';
import './LeafOrnament.css';

export default function LeafOrnament({ 
  className = '', 
  size = 'medium', 
  opacity = 0.5, 
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
    <img 
      src={leafImg}
      className={`leaf-ornament ${className}`}
      width={pxSize} 
      height={pxSize} 
      alt=""
      style={{ 
        opacity, 
        transform: `rotate(${rotation}deg)`,
        objectFit: 'contain'
      }}
      aria-hidden="true"
    />
  );
}
