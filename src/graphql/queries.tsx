import { gql } from "@apollo/client";

export const GET_PRODUCTS = gql`
  query GetProducts($categoryId: Int) {
    products(categoryId: $categoryId) {
      id
      name
      inStock
      description
      brand
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      attributes {
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      gallery
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: String!) {
    product(id: $id) {
      id
      name
      inStock
      description
      brand
      prices {
        amount
        currency {
          label
          symbol
        }
      }
      attributes {
        name
        type
        items {
          displayValue
          value
          id
        }
      }
      gallery
    }
  }
`;

export const GET_CATEGORIES = gql`
  query GetCategories {
    categories {
      id
      name
    }   
  }
`;


