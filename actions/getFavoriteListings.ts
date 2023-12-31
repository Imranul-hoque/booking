import { prismadb } from "@/lib/prismadb";

import { getUserSession } from "./current-user";

export default async function getFavoriteListings() {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      return [];
    }

    const favorites = await prismadb.listing.findMany({
      where: {
        id: {
          in: [...(currentUser.favoriteIds || [])]
        }
      }
    });

    const safeFavorites = favorites.map((favorite) => ({
      ...favorite,
      createdAt: favorite.createdAt.toString(),
    }));

    return safeFavorites;
  } catch (error: any) {
    throw new Error(error);
  }
}
