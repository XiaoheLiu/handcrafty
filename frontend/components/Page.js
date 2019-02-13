import React, { Component } from "react";
import styled from "styled-components";
import Header from "./Header";
import Meta from "./Meta";

const StyledPage = styled.div`
  background: green;
`;

const MyButton = styled.button`
  background: red;
  font-size: ${props => props.fontSize}px;
`;

class Page extends Component {
  render() {
    return (
      <StyledPage>
        <Meta />
        <Header />
        <MyButton fontSize="20">Button</MyButton>
        <MyButton fontSize="40">Button</MyButton>
        {this.props.children}
      </StyledPage>
    );
  }
}

export default Page;
