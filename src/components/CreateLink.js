import React, { useState } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import { FEED_QUERY } from "./LinkList";
import { LINKS_PER_PAGE } from "../constants";

const CreateLink = props => {
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  return (
    <>
      <div className="flex flex-column mt3">
        <input
          className="mb2"
          value={description}
          onChange={event => setDescription(event.target.value)}
          type="text"
          placeholder="A description for the link"
        />

        <input
          className="mb2"
          value={url}
          onChange={event => setUrl(event.target.value)}
          type="text"
          placeholder="The URL for the link"
        />
      </div>
      <Mutation
        mutation={POST_MUTATION}
        variables={{ description, url }}
        onError={alert}
        onCompleted={() => props.history.push("/new/1")}
        update={(store, { data: { post } }) => {
          const first = LINKS_PER_PAGE;
          const skip = 0;
          const orderBy = "createdAt_DESC";
          const data = store.readQuery({
            query: FEED_QUERY,
            variables: { first, skip, orderBy }
          });
          data.feed.links.unshift(post);
          store.writeQuery({
            query: FEED_QUERY,
            data,
            variables: { first, skip, orderBy }
          });
        }}
      >
        {PostMutation => <button onClick={PostMutation}>Submit</button>}
      </Mutation>
    </>
  );
};

export default CreateLink;

const POST_MUTATION = gql`
  mutation PostMutation($description: String!, $url: String!) {
    post(description: $description, url: $url) {
      id
      createdAt
      url
      description
    }
  }
`;
