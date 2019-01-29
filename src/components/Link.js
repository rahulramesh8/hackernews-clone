import React from "react";
import { timeDifferenceForDate } from "../utilities";
import { AUTH_TOKEN } from "../constants";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";

import "../styles/link.css";

const Link = props => {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return (
    <div className="flex mt2 items-start">
      <div className="flex items-center">
        <span className="gray">{props.index + 1}.</span>
        {authToken && (
          <Mutation
            mutation={VOTE_MUTATION}
            variables={{ linkId: props.link.id }}
            onError={alert}
            update={(store, { data: { vote } }) =>
              props.updateStoreAfterVote(store, vote, props.link.id)
            }
          >
            {voteMutation => (
              <div className="ml1 gray f11 upvote" onClick={voteMutation}>
                ▲
              </div>
            )}
          </Mutation>
        )}
      </div>
      <div className="ml1">
        <div>
          {props.link.description} ({props.link.url})
        </div>
        <div className="f6 lh-copy gray">
          {props.link.votes.length} votes | by{" "}
          {props.link.postedBy ? props.link.postedBy.name : "Unknown"}{" "}
          {timeDifferenceForDate(props.link.createdAt)}
        </div>
      </div>
    </div>
  );
};

export default Link;

const VOTE_MUTATION = gql`
  mutation VoteMutation($linkId: ID!) {
    vote(linkId: $linkId) {
      id
      link {
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
