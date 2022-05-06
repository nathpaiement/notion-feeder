import Parser from 'rss-parser';
import timeDifference from './helpers';
import { getFeedUrlsFromNotion } from './notion';

async function getNewFeedItemsFrom(feedUrl) {
  const parser = new Parser({
    customFields: {
      item: [['media:group', 'mediaGroup', { includeSnippet: true }]],
    },
  });
  let rss;
  try {
    rss = await parser.parseURL(feedUrl);
  } catch (error) {
    console.error(error);
    return [];
  }
  const todaysDate = new Date().getTime() / 1000;
  return rss.items.filter((item) => {
    const blogPublishedDate = new Date(item.pubDate).getTime() / 1000;
    const { diffInDays } = timeDifference(todaysDate, blogPublishedDate);
    return diffInDays === 0;
  });
}

export default async function* getNewFeedItems() {
  const allNewFeedItems = [];
  const feeds = await getFeedUrlsFromNotion();

  for (let i = 0; i < feeds.length; i++) {
    const { feedUrl, feedId } = feeds[i];
    const feedItems = await getNewFeedItemsFrom(feedUrl);
    const itemsContext = {
      feedId,
      feedUrl,
      feedItems,
    };

    yield itemsContext;
  }
}
