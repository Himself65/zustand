import create from 'zustand'
import { ssr } from 'zustand/middleware'

describe('ssr', () => {
  it('basic usage', () => {
    const result = create(
      ssr(
        () => ({ foo: '2' }),
        () => ({
          foo: '2',
        })
      )
    )
    expect(typeof result.getServerState).toBe('function')
  })
})
