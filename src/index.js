import getNewFeedItems from './feed';
import {
  addFeedItemToNotion,
  deleteOldUnreadFeedItemsFromNotion,
} from './notion';
import htmlToNotionBlocks from './parser';

async function index() {
  const generator = getNewFeedItems();
  let i;
  do {
    i = await generator.next();
    const feed = i.value;
    feed.feedItems.forEach(async (item) => {
      const notionItem = {
        feedId: feed.feedId,
        title: item.title,
        link: item.link,
        content: htmlToNotionBlocks(item.content),
      };
      await addFeedItemToNotion(notionItem);
    });
  } while (!i.done);

  await deleteOldUnreadFeedItemsFromNotion();
}

index();
