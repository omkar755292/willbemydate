import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import './App.css';

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function App() {
  const [accepted, setAccepted] = useState(false);
  const actionsRef = useRef(null);
  const noRef = useRef(null);
  const [noPos, setNoPos] = useState({ x: 0, y: 0 });
  const [bounds, setBounds] = useState({ w: 0, h: 0 });

  useLayoutEffect(() => {
    const el = actionsRef.current;
    if (!el) return;

    const update = () => {
      const rect = el.getBoundingClientRect();
      setBounds({ w: rect.width, h: rect.height });
    };

    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    window.addEventListener('resize', update);

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, []);

  const moveNoSomewhereElse = useCallback(() => {
    const btn = noRef.current;
    if (!btn) return;

    const rect = btn.getBoundingClientRect();
    const pad = 12;
    const maxX = Math.max(0, bounds.w - rect.width - pad);
    const maxY = Math.max(0, bounds.h - rect.height - pad);

    const nextX = maxX <= pad ? 0 : clamp(Math.random() * maxX, pad, maxX);
    const nextY = maxY <= pad ? 0 : clamp(Math.random() * maxY, pad, maxY);

    setNoPos({ x: nextX, y: nextY });
  }, [bounds.h, bounds.w]);

  useLayoutEffect(() => {
    if (!accepted) {
      moveNoSomewhereElse();
    }
  }, [accepted, moveNoSomewhereElse]);

  if (accepted) {
    return (
      <div className="App">
        <div className="screen">
          <div className="card">
            <h1 className="title">Yayyy Divya said YES</h1>
            <p className="subtitle">
              I promise to make this date full of smiles, cute talks, and warm moments.
              <br />
              Pick a day and I’ll be ready with my best outfit and my best heart.
            </p>
            <button className="btn btnPrimary" onClick={() => setAccepted(false)}>
              Ask again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="App">
      <div className="screen">
        <div className="card">
          <h1 className="title">Divya, will you go on a date with me?</h1>
          <p className="subtitle">One cute “yes” and I’ll plan something special.</p>

          <div className="actions" ref={actionsRef}>
            <button className="btn btnYes" onClick={() => setAccepted(true)}>
              <span className="btnYesLabel">Yes</span>
            </button>

            <button
              ref={noRef}
              className="btn btnNo"
              style={{ transform: `translate(${noPos.x}px, ${noPos.y}px)` }}
              onPointerEnter={moveNoSomewhereElse}
              onPointerMove={moveNoSomewhereElse}
              onPointerDown={(e) => {
                e.preventDefault();
                moveNoSomewhereElse();
              }}
              onFocus={moveNoSomewhereElse}
              type="button"
            >
              No
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
