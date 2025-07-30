export const applyDefaultStyle = (img: HTMLImageElement) => {
    img.style.filter = 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))';
    img.style.transform = 'scale(1)';
    img.style.transition = 'all 0.3s ease';
  };
  
  export const applySelectedStyle = (img: HTMLImageElement) => {
    img.style.filter = 'drop-shadow(0px 4px 6px rgba(0, 0, 0, 0.6))';
    img.style.transform = 'scale(1.7)';
    img.style.transition = 'all 0.3s ease';
  };
  
  export const applyDimmedStyle = (img: HTMLImageElement) => {
    img.style.filter =
      'grayscale(100%) brightness(0.8) drop-shadow(0px 2px 3px rgba(25, 28, 190, 0.15))';
    img.style.transform = 'scale(0.8)';
    img.style.transition = 'all 0.3s ease';
  };