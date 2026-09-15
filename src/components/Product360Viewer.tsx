import React, { useEffect, useRef, useState } from 'react';

interface Product360ViewerProps {
  images: string[];
  title: string;
  onClose: () => void;
}

const MIN_ZOOM = 1;
const MAX_ZOOM = 4;

export const Product360Viewer: React.FC<Product360ViewerProps> = ({ images, title, onClose }) => {
  const frames = images.filter(Boolean);
  const [frame, setFrame] = useState(0);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef<{ x: number; y: number; frame: number; offsetX: number; offsetY: number } | null>(null);
  const pinchDistance = useRef<number | null>(null);
  const isFullSpin = frames.length >= 12;

  useEffect(() => {
    frames.forEach((source) => {
      const image = new Image();
      image.src = source;
    });
  }, [frames]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowRight') setFrame((current) => (current + 1) % frames.length);
      if (event.key === 'ArrowLeft') setFrame((current) => (current - 1 + frames.length) % frames.length);
      if (event.key === '+' || event.key === '=') setZoom((current) => Math.min(MAX_ZOOM, current + 0.25));
      if (event.key === '-') setZoom((current) => Math.max(MIN_ZOOM, current - 0.25));
    };
    window.addEventListener('keydown', onKeyDown);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = '';
    };
  }, [frames.length, onClose]);

  useEffect(() => {
    if (zoom === 1) setOffset({ x: 0, y: 0 });
  }, [zoom]);

  const changeZoom = (next: number) => setZoom(Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, next)));

  const onPointerDown = (event: React.PointerEvent<HTMLDivElement>) => {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, frame, offsetX: offset.x, offsetY: offset.y };
  };

  const onPointerMove = (event: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current) return;
    const deltaX = event.clientX - drag.current.x;
    const deltaY = event.clientY - drag.current.y;
    if (zoom > 1) {
      setOffset({ x: drag.current.offsetX + deltaX, y: drag.current.offsetY + deltaY });
      return;
    }
    const sensitivity = isFullSpin ? 12 : 45;
    const steps = Math.trunc(deltaX / sensitivity);
    setFrame((drag.current.frame - steps % frames.length + frames.length) % frames.length);
  };

  const endPointer = () => { drag.current = null; };

  const touchDistance = (touches: React.TouchList) => {
    const x = touches[0].clientX - touches[1].clientX;
    const y = touches[0].clientY - touches[1].clientY;
    return Math.hypot(x, y);
  };

  if (frames.length === 0) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-2 sm:p-4"
      role="dialog"
      aria-modal="true"
      aria-label={`Visualizador de ${title}`}
      onMouseDown={(event) => { if (event.target === event.currentTarget) onClose(); }}
    >
      <div className="eden-card bg-white w-full max-w-6xl max-h-[calc(100dvh-1rem)] sm:max-h-[calc(100dvh-2rem)] overflow-y-auto shadow-2xl border border-[#e9e8e6]">
        <header className="flex items-start justify-between gap-4 px-4 py-4 sm:px-6 border-b border-[#e9e8e6]">
          <div>
            <span className="font-['Plus_Jakarta_Sans'] text-[10px] uppercase font-bold tracking-widest text-[#7d5540] block mb-1">
              {isFullSpin ? 'Visualização 360° real' : 'Visualização multiângulo real'}
            </span>
            <h4 className="font-['Playfair_Display'] text-xl sm:text-2xl text-[#1a1c1b]">{title}</h4>
          </div>
          <button onClick={onClose} className="p-2 text-black hover:text-[#7d5540]" aria-label="Fechar visualizador">
            <span className="material-symbols-outlined text-[26px]">close</span>
          </button>
        </header>

        <div
          className={`relative h-[48dvh] min-h-72 sm:h-[62dvh] bg-[#171918] overflow-hidden select-none touch-none ${zoom > 1 ? 'cursor-grab active:cursor-grabbing' : 'cursor-ew-resize'}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endPointer}
          onPointerCancel={endPointer}
          onWheel={(event) => {
            event.preventDefault();
            changeZoom(zoom + (event.deltaY < 0 ? 0.25 : -0.25));
          }}
          onDoubleClick={() => changeZoom(zoom === 1 ? 2.5 : 1)}
          onTouchStart={(event) => {
            if (event.touches.length === 2) pinchDistance.current = touchDistance(event.touches);
          }}
          onTouchMove={(event) => {
            if (event.touches.length !== 2 || pinchDistance.current === null) return;
            const distance = touchDistance(event.touches);
            changeZoom(zoom * (distance / pinchDistance.current));
            pinchDistance.current = distance;
          }}
          onTouchEnd={() => { pinchDistance.current = null; }}
        >
          <img
            src={frames[frame]}
            alt={`${title}, vista ${frame + 1} de ${frames.length}`}
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain will-change-transform"
            style={{ transform: `translate3d(${offset.x}px, ${offset.y}px, 0) scale(${zoom})`, transition: drag.current ? 'none' : 'transform 120ms ease-out' }}
          />

          <div className="absolute left-3 bottom-3 right-3 flex flex-wrap items-end justify-between gap-2 pointer-events-none">
            <span className="px-3 py-2 bg-black/75 text-white text-[11px] font-['Plus_Jakarta_Sans'] flex items-center gap-2">
              <span className="material-symbols-outlined text-[17px] text-[#fec9ae]">{zoom > 1 ? 'pan_tool' : '360'}</span>
              {zoom > 1 ? 'Arraste para examinar o material' : `Arraste para mudar de vista • ${frame + 1}/${frames.length}`}
            </span>
            <span className="px-2 py-1 bg-black/75 text-white text-[10px] font-mono">{Math.round(zoom * 100)}%</span>
          </div>
        </div>

        <footer className="px-4 py-4 sm:px-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button onClick={() => changeZoom(zoom - 0.25)} disabled={zoom <= MIN_ZOOM} className="w-10 h-10 border border-[#cdc5bd] disabled:opacity-35" aria-label="Diminuir zoom">−</button>
            <button onClick={() => changeZoom(zoom + 0.25)} disabled={zoom >= MAX_ZOOM} className="w-10 h-10 border border-[#cdc5bd] disabled:opacity-35" aria-label="Aumentar zoom">+</button>
            <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }} className="h-10 px-3 border border-[#cdc5bd] text-[10px] uppercase font-semibold">Repor</button>
          </div>
          <p className="text-[11px] text-[#7c766f] font-['Plus_Jakarta_Sans'] max-w-xl">
            {isFullSpin
              ? `${frames.length} fotografias reais ordenadas compõem esta rotação. Use o scroll ou pinça para ampliar até 400%.`
              : `${frames.length} vistas reais disponíveis. Para uma volta 360° contínua, este produto precisa de pelo menos 12 frames fotografados ao redor da peça.`}
          </p>
          <button onClick={onClose} className="h-10 px-6 bg-black text-white uppercase text-[11px] font-semibold tracking-wider">Concluir</button>
        </footer>
      </div>
    </div>
  );
};
