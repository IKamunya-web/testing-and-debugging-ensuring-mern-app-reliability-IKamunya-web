import { useState, useCallback } from 'react';

export default function useToggle(initial = false) {
  const [on, setOn] = useState(Boolean(initial));
  const toggle = useCallback(() => setOn(o => !o), []);
  const set = useCallback(val => setOn(Boolean(val)), []);
  return { on, toggle, set };
}
