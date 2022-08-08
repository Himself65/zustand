import { StateCreator, StoreApi, StoreMutatorIdentifier } from 'zustand'

type GetServerState<T> = () => T

type WithSSR<S> = S extends StoreApi
  ? StoreApi & {
      getServerState: GetServerState<S>
    }
  : never

export type SSR = <
  T extends object,
  Mps extends [StoreMutatorIdentifier, unknown][] = [],
  Mcs extends [StoreMutatorIdentifier, unknown][] = [],
  U = T
>(
  initializer: StateCreator<T, [...Mps, ['zustand/ssr', unknown]], Mcs>,
  getServerState: GetServerState<T>
) => StateCreator<T, Mps, [['zustand/ssr', U], ...Mcs]>

declare module '../vanilla' {
  interface StoreMutators<S, A> {
    'zustand/ssr': WithSSR<S>
  }
}

type SSRImpl = <T extends object>(
  storeInitializer: PopArgument<StateCreator<T, [], []>>,
  getServerState: GetServerState<T>
) => PopArgument<StateCreator<T, [], []>>

type PopArgument<T extends (...a: never[]) => unknown> = T extends (
  ...a: [...infer A, infer _]
) => infer R
  ? (...a: A) => R
  : never

export const ssrImpl: SSRImpl =
  (storeInitializer, getServerState) => (get, set, api) => {
    ;(api as any).getServerState = getServerState
    return storeInitializer(get, set, api)
  }

export const ssr = ssrImpl as unknown as SSR
