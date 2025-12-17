import rootsLogoIcon from '../assets/roots-logo.png.png';

const RootsLogo = ({ width = 40, height = 40, className = '' }) => {
  return (
    <img 
      src={rootsLogoIcon}
      alt="Roots Logo"
      width={width}
      height={height}
      className={className}
      style={{ display: 'block' }}
    />
  );
};

export default RootsLogo;
