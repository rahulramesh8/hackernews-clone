import React from "react";
import Link from "./Link";
import gql from "graphql-tag";
import { Query } from "react-apollo";

const LinkList = () => {
  return (
    <Query query={FEED_QUERY}>
      {({ loading, error, data }) => {
        if (loading) return <>Fetching</>;
        if (error) return <>Error: {error}</>;

        const linksToRender = data.feed.links;
        return (
          <>
            {linksToRender.map(link => (
              <Link key={link.id} link={link} />
            ))}
          </>
        );
      }}
    </Query>
  );
};

export default LinkList;

const FEED_QUERY = gql`
  {
    feed {
      links {
        id
        createdAt
        url
        description
      }
    }
  }
`;
