import React, { useState } from "react";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

const CreateLink = props => {
  const handleMutationComplete = () => props.history.push("/");

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
        onCompleted={handleMutationComplete}
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
