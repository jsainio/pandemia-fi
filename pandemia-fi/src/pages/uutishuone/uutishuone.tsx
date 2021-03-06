import React from "react";
import { Card, Heading, Flex, Box, Button } from "rebass";
import { SpinnerBlock } from "../../components/spinner";
import NewsFeedItem from "./components/news-feed-item";
import SidebarItem from "./components/sidebar-item";
import fetchAllFeedsAndItems from "././../../lib/feeds-api";

const PAGE_SIZE = 10;

type SelectedFeedIds = { [key: number]: boolean };

/**
 * Uutishuone section of the website
 */
const Uutishuone: React.FunctionComponent = () => {
  const [isLoading, setIsLoading] = React.useState<boolean>(true);
  const [feeds, setFeeds] = React.useState<Feed[]>([]);
  const [feedItems, setFeedItems] = React.useState<FeedItem[]>([]);
  const [pageNumber, setPageNumber] = React.useState<number>(1);
  const [selectedFeedIds, setSelectedFeedIds] = React.useState<SelectedFeedIds>(
    {}
  );

  const toggleSelectedFeedId = (feedId: number) => {
    setSelectedFeedIds({
      ...selectedFeedIds,
      [feedId]: !selectedFeedIds[feedId],
    });
    setPageNumber(1);
  };

  React.useEffect(() => {
    async function fetchFeedsAndItems() {
      const results = await fetchAllFeedsAndItems();
      setFeeds(results.feeds);
      setFeedItems(results.feedItems);
      setIsLoading(false);
    }
    fetchFeedsAndItems();
  }, []);

  const hasActiveFilters = React.useMemo(() => {
    return Object.values(selectedFeedIds).some(Boolean);
  }, [selectedFeedIds]);

  const filteredFeedItem = React.useMemo(() => {
    if (!hasActiveFilters) {
      return feedItems;
    }
    return feedItems.filter((item) => selectedFeedIds[item.feedId]);
  }, [feedItems, selectedFeedIds, hasActiveFilters]);

  const paginatedFilteredFeedItems = React.useMemo(() => {
    return filteredFeedItem.slice(0, PAGE_SIZE * pageNumber);
  }, [filteredFeedItem, pageNumber]);

  const renderContent = () => (
    <>
      {paginatedFilteredFeedItems.map((feedItem, index) => (
        <NewsFeedItem feedItem={feedItem} key={`${feedItem.feedId}-${index}`} />
      ))}
      <Flex justifyContent="center">
        <Box
          sx={{
            pt: 3,
          }}
        >
          <Button
            variant="outline"
            onClick={() => setPageNumber(pageNumber + 1)}
            sx={{
              cursor: "pointer",
            }}
          >
            Näytä lisää
          </Button>
        </Box>
      </Flex>
    </>
  );

  return (
    <Flex
      flexWrap="wrap"
      flexDirection="row-reverse"
      sx={{
        p: 0,
      }}
    >
      <Box p={2} width={["100%", "100%", "30%"]}>
        <Card
          p={2}
          sx={{
            boxShadow: "menu",
            borderWidth: "1pt",
            borderStyle: "solid",
            borderColor: "text",
          }}
        >
          {/* Feeds selector heading */}
          <Heading
            sx={{
              fontSize: 2,
            }}
          >
            Valitse: tiedotteet, luetuimmat, poiminnat…
          </Heading>
          {feeds.map((feed) => (
            <SidebarItem
              feed={feed}
              isSelected={!hasActiveFilters || !!selectedFeedIds[feed.id]}
              onClick={() => toggleSelectedFeedId(feed.id)}
              key={feed.id}
            />
          ))}
        </Card>
      </Box>
      <Box
        width={["100%", "100%", "70%"]}
        sx={{
          p: 0,
        }}
      >
        <Card
          sx={{
            p: 0,
            maxWidth: "100%",
          }}
        >
          <Heading
            sx={{
              fontSize: 4,
              p: 2,
              pb: 1,
            }}
          >
            Uutishuone
          </Heading>
          {isLoading && <SpinnerBlock />}
          {!isLoading && renderContent()}
        </Card>
      </Box>
    </Flex>
  );
};

export default Uutishuone;
