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
    if (i.value) {
      const feed = i.value;
      feed.feedItems.forEach(async (item) => {
        const content =
          item.content || item.mediaGroup['media:description'].join() || '';

        const notionItem = {
          feedId: feed.feedId,
          title: item.title,
          link: item.link,
          content: content.length ? htmlToNotionBlocks(content) : null,
          contentSnippet: content.length ? content : null,
        };
        await addFeedItemToNotion(notionItem);
      });
    }
  } while (!i.done);

  await deleteOldUnreadFeedItemsFromNotion();
}

index();
