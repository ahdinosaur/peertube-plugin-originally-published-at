async function register ({
  registerHook,
  registerSetting,
  settingsManager,
  storageManager,
  videoCategoryManager,
  videoLicenceManager,
  videoLanguageManager
}) {
  // sort by +/- originallyPublishedAt
  registerHook({
    target: 'filter:api.videos.list.params',
    handler: setSortParams,
  })
  registerHook({
    target: 'filter:api.accounts.videos.list.params',
    handler: setSortParams,
  })
  registerHook({
    target: 'filter:api.video-channels.videos.list.params',
    handler: setSortParams,
  })
  registerHook({
    target: 'filter:api.user.me.videos.list.params',
    handler: setSortParams,
  })
  registerHook({
    target: 'filter:api.search.videos.local.list.params',
    handler: setSortParams,
  })
  registerHook({
    target: 'filter:api.search.videos.index.list.params',
    handler: setSortParams,
  })

  // return originallyPublishedAt in place of publishedAt
  registerHook({
    target: 'filter:api.video.get.result',
    handler: setPublishedAt,
  })
  registerHook({
    target: 'filter:api.videos.list.result',
    handler: mapList(setPublishedAt),
  })
  registerHook({
    target: 'filter:api.accounts.videos.list.result',
    handler: mapList(setPublishedAt),
  })
  registerHook({
    target: 'filter:api.video-channels.videos.list.result',
    handler: mapList(setPublishedAt),
  })
  registerHook({
    target: 'filter:api.user.me.videos.list.result',
    handler: mapList(setPublishedAt),
  })
  registerHook({
    target: 'filter:api.search.videos.local.list.result',
    handler: mapList(setPublishedAt),
  })
  registerHook({
    target: 'filter:api.search.videos.index.list.result',
    handler: mapList(setPublishedAt),
  })
}

async function unregister () {
  return
}

module.exports = {
  register,
  unregister
}

function setSortParams(params) {
  return {
    ...params,
    sort: params.sort === '-publishedAt' ?
      '-originallyPublishedAt' :
      params.sort === 'publishedAt' ?
      'originallyPublishedAt' :
      params.sort,
  }
}

function setPublishedAt(video) {
  return Object.assign(video, {
    publishedAt: video.originallyPublishedAt || video.publishedAt,
  })
}

function mapList(mapper) {
  return ({ data, total }) => ({
    data: data.map(mapper),
    total,
  })
}
