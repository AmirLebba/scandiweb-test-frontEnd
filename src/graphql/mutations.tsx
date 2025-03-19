import { gql } from "@apollo/client";

export const PLACE_ORDER = gql`
  mutation PlaceOrder($items: [String!]!) {
    placeOrder(items: $items) {
      success
      message
    }
  }
`;
