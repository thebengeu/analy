const script = document.currentScript as HTMLScriptElement
const urlPrefix = script.src.slice(0, -12)
const {
  screen: { width, height },
  navigator: { language },
  location: { hostname, pathname, search },
} = window
let pathAndQuery = `${pathname}${search}`
let referrer = document.referrer

const collectPageView = (): void => {
  void fetch(urlPrefix + 'api/pageview', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      height,
      hostname,
      language,
      pathAndQuery,
      referrer,
      width,
    }),
  })
}

// eslint-disable-next-line @typescript-eslint/ban-types
const monkeyPatch = (target: any, method: string, replacement: Function) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
  const original = target[method]
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  target[method] = (...args: any[]) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access,  @typescript-eslint/no-unsafe-call
    const result = original.apply(target, args)
    replacement(...args)
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return result
  }
}

const handleHistoryUpdate = (_data: any, _title: string, url?: string) => {
  referrer = pathAndQuery
  pathAndQuery = `${location.pathname}${location.search}`
  if (!url || pathAndQuery === referrer) {
    return
  }

  collectPageView()
}

monkeyPatch(history, 'pushState', handleHistoryUpdate)
monkeyPatch(history, 'replaceState', handleHistoryUpdate)
collectPageView()

export {}
