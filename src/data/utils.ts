export const applySelectedStyle = (img: HTMLImageElement) => {
    img.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.6))';
    img.style.transform = 'scale(1.5)';
    img.style.transition = 'all 0.3s ease';
  };
  
  export const applyDimmedStyle = (img: HTMLImageElement) => {
    img.style.filter = 'grayscale(100%) brightness(0.8)';
    img.style.transform = 'scale(0.8)';
    img.style.transition = 'all 0.3s ease';
  };
  
  export const applyDefaultStyle = (img: HTMLImageElement) => {
    img.style.filter = 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))';
    img.style.transform = 'scale(1)';
    img.style.transition = 'all 0.3s ease';
  };