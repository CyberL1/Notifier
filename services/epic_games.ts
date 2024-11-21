import type { Service } from "#src/types.ts";
import { sendToChannel } from "#src/utils/sendToChannel.ts";

export const run = async (service: Service) => {
  const apiUrl =
    "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions";

  const { data } = await (await fetch(apiUrl)).json();
  const games = data.Catalog.searchStore.elements;

  for (const game of games) {
    if (
      game.price.totalPrice.discount !== game.price.totalPrice.originalPrice
    ) {
      continue;
    }

    sendToChannel(service.channel, {
      title: game.title,
      description: game.description,
      imageUrl: game.keyImages[0].url,
      originalPrice: game.price.totalPrice.fmtPrice.originalPrice,
      openUrl: `https://epicgames.com/p/${game.offerMappings[0].pageSlug}`,
    });
  }
};
