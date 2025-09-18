const { TwitterApi } = require('twitter-api-v2');
require('dotenv').config();

const client = new TwitterApi(process.env.BEARER_TOKEN);

async function fetchPosts() {
  try {
    const user = await client.v2.userByUsername('march_sadnessx');
    if (!user.data) {
      throw new Error('User not found');
    }
    const userId = user.data.id;
    const tweets = await client.v2.userTimeline(userId, {
      max_results: 100,
      'tweet.fields': ['text', 'created_at'],
      expansions: ['attachments.media_keys'],
      'media.fields': ['url', 'type'],
    });

    const mediaPosts = [];
    for await (const tweet of tweets) {
      if (tweet.attachments?.media_keys && tweets.includes?.media) {
        const media = tweets.includes.media.find(m => tweet.attachments.media_keys.includes(m.media_key));
        if (media && (media.type === 'photo' || media.type === 'video')) {
          mediaPosts.push({
            id: tweet.id,
            text: tweet.text,
            media: media.url || (media.variants && media.variants[0]?.url),
            type: media.type,
          });
        }
      }
    }
    console.log(mediaPosts);
  } catch (err) {
    console.error('Error:', err.message);
  }
}

fetchPosts();