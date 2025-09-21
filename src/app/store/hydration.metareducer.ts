import { ActionReducer, INIT, UPDATE } from '@ngrx/store';

export function hydrationMetaReducer<S, A extends { type: string }>(reducer: ActionReducer<S, A>) {
  return (state: S | undefined, action: A): S => {
    if (action.type === INIT || action.type === UPDATE) {
      const storageValue = localStorage.getItem('appState');
      if (storageValue) return JSON.parse(storageValue) as S;
    }
    const next = reducer(state, action);
    localStorage.setItem('appState', JSON.stringify(next));
    return next;
  };
}
