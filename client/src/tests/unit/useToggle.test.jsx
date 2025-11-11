import { renderHook, act } from '@testing-library/react';
import useToggle from '../../hooks/useToggle';

describe('useToggle hook', () => {
  it('initializes with false by default and toggles', () => {
    const { result } = renderHook(() => useToggle());
    expect(result.current.on).toBe(false);
    act(() => result.current.toggle());
    expect(result.current.on).toBe(true);
  });

  it('accepts initial true and set works', () => {
    const { result } = renderHook(() => useToggle(true));
    expect(result.current.on).toBe(true);
    act(() => result.current.set(false));
    expect(result.current.on).toBe(false);
  });
});
