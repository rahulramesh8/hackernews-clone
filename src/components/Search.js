import React, { useState } from "react";
import gql from "graphql-tag";
import { withApollo } from "react-apollo";

import Link from "./Link";

const Search = props => {
  const [links, setLinks] = useState([]);
  const [filter, setFilter] = useState("");

  const _executeSearch = async () => {
    const result = await props.client.query({
      query: FEED_SEARCH_QUERY,
      variables: { filter }
    });

    const linksFromResult = result.data.feed.links;
    setLinks(linksFromResult);
  };

  return (
    <>
      <div>
        Search
        <input type="text" onChange={event => setFilter(event.target.value)} />
        <button onClick={_executeSearch}>OK</button>
      </div>
      {links.map((link, index) => (
        <Link key={link.id} link={link} index={index} />
      ))}
    </>
  );
};

export default withApollo(Search);
//The withApollo HOC gives you this.props.client
//This lets you send a query manually at any time inside the component

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      links {
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
  }
`;
