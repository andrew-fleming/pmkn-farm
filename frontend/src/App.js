import styled from "styled-components";
import Main from "./components/Main";

const Container = styled.div`
  width: 100%;
  height: 45.5rem;
`;

function App() {
  return (
    <Container>
        <Main />
    </Container>
  );
}

export default App;
