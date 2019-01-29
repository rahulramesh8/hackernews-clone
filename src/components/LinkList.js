import React from "react";
import Link from "./Link";
import gql from "graphql-tag";
import { Query } from "react-apollo";

import { LINKS_PER_PAGE } from "../constants";

const LinkList = props => {
  const isNewPage = props.location.pathname.includes("new");

  return (
    <Query
      query={FEED_QUERY}
      variables={_getQueryVariables({ isNewPage, props })}
    >
      {({ loading, error, data, subscribeToMore }) => {
        if (loading) return <>Fetching</>;
        if (error) return <>Error: {error}</>;
        _subscribeToNewLinks(subscribeToMore);
        _subscribeToNewVotes(subscribeToMore);

        const linksToRender = _getLinksToRender({ data, isNewPage });
        const pageIndex = props.match.params.page
          ? (props.match.params.page - 1) * LINKS_PER_PAGE
          : 0;
        return (
          <>
            {linksToRender.map((link, index) => (
              <Link
                key={link.id}
                link={link}
                index={index + pageIndex}
                updateStoreAfterVote={(store, createVote, linkId) =>
                  _updateCacheAfterVote({ store, createVote, linkId, props })
                }
              />
            ))}
            {isNewPage && (
              <div className="flex ml4 mv3 gray">
                <div
                  className="pointer mr2"
                  onClick={() => _previousPage({ props })}
                >
                  Previous
                </div>
                <div
                  className="pointer"
                  onClick={() => _nextPage({ data, props })}
                >
                  Next
                </div>
              </div>
            )}
          </>
        );
      }}
    </Query>
  );
};

export default LinkList;

//Pagination related functions

const _getQueryVariables = ({ isNewPage, props }) => {
  const page = parseInt(props.match.params.page, 10);

  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;
  return { first, skip, orderBy }; //These will be the variables to the query
};

const _getLinksToRender = ({ data, isNewPage }) => {
  if (isNewPage) {
    return data.feed.links;
  }
  const rankedLinks = data.feed.links.slice();
  rankedLinks.sort((l1, l2) => l2.votes.length - l1.votes.length);
  return rankedLinks;
};

const _nextPage = ({ data, props }) => {
  const page = parseInt(props.match.params.page, 10);
  if (page <= data.feed.count / LINKS_PER_PAGE) {
    const nextPage = page + 1;
    props.history.push(`/new/${nextPage}`);
  }
};

const _previousPage = ({ props }) => {
  const page = parseInt(props.match.params.page, 10);
  if (page > 1) {
    const previousPage = page - 1;
    props.history.push(`/new/${previousPage}`);
  }
};

//GraphQL related functions

const _updateCacheAfterVote = ({ store, createVote, linkId, props }) => {
  const isNewPage = props.location.pathname.includes("new");
  const page = parseInt(props.match.params.page, 10);

  const skip = isNewPage ? (page - 1) * LINKS_PER_PAGE : 0;
  const first = isNewPage ? LINKS_PER_PAGE : 100;
  const orderBy = isNewPage ? "createdAt_DESC" : null;
  const data = store.readQuery({
    query: FEED_QUERY,
    variables: { first, skip, orderBy }
  });

  const votedLink = data.feed.links.find(link => link.id === linkId);
  votedLink.votes = createVote.link.votes;

  store.writeQuery({ query: FEED_QUERY, data });
};

const _subscribeToNewLinks = subscribeToMore => {
  subscribeToMore({
    document: NEW_LINKS_SUBSCRIPTION,
    updateQuery: (prev, { subscriptionData }) => {
      if (!subscriptionData.data) return prev;
      const newLink = subscriptionData.data.newLink;

      return Object.assign({}, prev, {
        feed: {
          links: [newLink, ...prev.feed.links],
          count: prev.feed.links.length + 1,
          __typename: prev.feed.__typename
        }
      });
    }
  });
};

const _subscribeToNewVotes = subscribeToMore => {
  subscribeToMore({
    document: NEW_VOTES_SUBSCRIPTION
  });
};

//GraphQL queries and subscriptions

export const FEED_QUERY = gql`
  query FeedQuery($first: Int, $skip: Int, $orderBy: LinkOrderByInput) {
    feed(first: $first, skip: $skip, orderBy: $orderBy) {
      links {
        id
        createdAt
        url
        description
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      count
    }
  }
`;

const NEW_LINKS_SUBSCRIPTION = gql`
  subscription {
    newLink {
      id
      url
      description
      createdAt
      postedBy {
        id
        name
      }
      votes {
        id
        user {
          id
        }
      }
    }
  }
`;

const NEW_VOTES_SUBSCRIPTION = gql`
  subscription {
    newVote {
      id
      link {
        id
        url
        description
        createdAt
        postedBy {
          id
          name
        }
        votes {
          id
          user {
            id
          }
        }
      }
      user {
        id
      }
    }
  }
`;
