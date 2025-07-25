// utils/markerFactory.ts

export function createMarkerElement(
    id: string,
    name: string,
    iconUrl: string,
    type: 'location' | 'foodprint'
  ): HTMLDivElement {
    const el = document.createElement('div');
    el.className = `custom-marker ${type}-marker`;
    el.setAttribute('data-marker-id', id);
    el.style.cursor = 'pointer';
    el.tabIndex = -1;
  
    const iconWrapper = document.createElement('div');
    iconWrapper.className = `marker-icon ${type}-icon`;
  
    const img = document.createElement('img');
    img.src = iconUrl;
    img.alt = name;
    img.style.width = '36px';
    img.style.height = 'auto';
    img.style.pointerEvents = 'none';
    img.style.filter = 'drop-shadow(0px 3px 3px rgba(0, 0, 0, 0.4))';
    img.style.transition = 'all 0.3s ease';
  
    iconWrapper.appendChild(img);
    el.appendChild(iconWrapper);
  
    return el;
  }
  